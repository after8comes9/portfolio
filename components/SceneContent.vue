<script setup lang="ts">
import { ref, onMounted, onUnmounted, shallowRef } from 'vue'
import { useLoop } from '@tresjs/core'
import * as THREE from 'three'
import gsap from 'gsap'
import type { CaseData } from '~/composables/useCaseData'
import { computeOpacity, getActiveFraction } from '~/composables/useActiveFraction'

import vertexShader from '~/shaders/distortion.vert?raw'
import fragmentShader from '~/shaders/distortion.frag?raw'

const props = defineProps<{
  cases: CaseData[]
  scrollVelocity: number
  scrollY: number
}>()

const emit = defineEmits<{
  openVideo: [src: string]
}>()

const groupRef = shallowRef<THREE.Group>()
const materials = shallowRef<THREE.ShaderMaterial[]>([])
const glowMaterials = shallowRef<THREE.MeshBasicMaterial[]>([])
const mouse = ref(new THREE.Vector2(0.5, 0.5))
const targetRotation = ref({ x: 0, y: 0 })
const raycaster = new THREE.Raycaster()
const ndcMouse = new THREE.Vector2()
let hoveredVideo = -1
let isMobile = false

const STATION_SPACING = 6
const CAMERA_Z = 4
const VIEW_DIST = 4
const MOBILE_CHECK = typeof window !== 'undefined' && window.innerWidth < 768

function planeLocalZ(i: number): number {
  return -(i * STATION_SPACING)
}

function videoPos(i: number): [number, number, number] {
  if (isMobile) return [0, -0.3, planeLocalZ(i)]
  const side = i % 2 === 0 ? 1 : -1
  return [side * 0.55, 0, planeLocalZ(i)]
}

function videoRot(i: number): [number, number, number] {
  if (isMobile) return [0, 0, 0]
  const side = i % 2 === 0 ? 1 : -1
  return [0, -side * 0.12, 0]
}

function createPlaceholderTexture(): THREE.Texture {
  const canvas = document.createElement('canvas')
  canvas.width = 4
  canvas.height = 4
  const ctx = canvas.getContext('2d')!
  ctx.fillStyle = '#0a0a0a'
  ctx.fillRect(0, 0, 4, 4)
  const texture = new THREE.CanvasTexture(canvas)
  texture.needsUpdate = true
  return texture
}

function findCamera(): THREE.PerspectiveCamera | undefined {
  return groupRef.value?.parent?.children.find(
    (c): c is THREE.PerspectiveCamera => c instanceof THREE.PerspectiveCamera
  )
}

function findVideoMeshes(): THREE.Mesh[] {
  if (!groupRef.value) return []
  return groupRef.value.children.filter(
    (c): c is THREE.Mesh => (c as THREE.Mesh).isMesh && c.userData?.videoIndex !== undefined
  )
}

// Named handlers for proper cleanup
function onMouseMove(e: MouseEvent) {
  mouse.value.x = e.clientX / window.innerWidth
  mouse.value.y = 1 - e.clientY / window.innerHeight
  targetRotation.value.y = (e.clientX / window.innerWidth - 0.5) * 0.08
  targetRotation.value.x = (e.clientY / window.innerHeight - 0.5) * -0.05
  ndcMouse.x = (e.clientX / window.innerWidth) * 2 - 1
  ndcMouse.y = -(e.clientY / window.innerHeight) * 2 + 1
}

function onDeviceOrientation(e: DeviceOrientationEvent) {
  if (e.gamma !== null && e.beta !== null) {
    targetRotation.value.y = (e.gamma / 90) * 0.08
    targetRotation.value.x = ((e.beta - 45) / 90) * -0.05
  }
}

function onClick(e: MouseEvent) {
  if (isMobile) {
    ndcMouse.x = (e.clientX / window.innerWidth) * 2 - 1
    ndcMouse.y = -(e.clientY / window.innerHeight) * 2 + 1
    const camera = findCamera()
    if (camera) {
      raycaster.setFromCamera(ndcMouse, camera)
      const hits = raycaster.intersectObjects(findVideoMeshes())
      if (hits.length > 0) {
        emit('openVideo', props.cases[hits[0].object.userData.videoIndex].video)
      }
    }
  } else if (hoveredVideo >= 0) {
    emit('openVideo', props.cases[hoveredVideo].video)
  }
}

onMounted(() => {
  isMobile = window.innerWidth < 768

  const mats: THREE.ShaderMaterial[] = []
  props.cases.forEach((c) => {
    const video = document.createElement('video')
    video.crossOrigin = 'anonymous'
    video.src = c.video
    video.loop = true
    video.muted = true
    video.playsInline = true
    video.preload = 'auto'

    const videoTex = new THREE.VideoTexture(video)
    videoTex.minFilter = THREE.LinearFilter
    videoTex.magFilter = THREE.LinearFilter

    const mat = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uTexture: { value: createPlaceholderTexture() },
        uTime: { value: 0 },
        uMouse: { value: new THREE.Vector2(0.5, 0.5) },
        uHover: { value: 0 },
        uOpacity: { value: 0 },
      },
      transparent: true,
    })

    video.play().then(() => {
      mat.uniforms.uTexture.value = videoTex
    }).catch(() => {})

    mats.push(mat)
  })
  materials.value = mats

  const glowMats: THREE.MeshBasicMaterial[] = []
  props.cases.forEach((c) => {
    glowMats.push(new THREE.MeshBasicMaterial({
      color: new THREE.Color(c.color),
      transparent: true,
      opacity: 0,
    }))
  })
  glowMaterials.value = glowMats

  window.addEventListener('mousemove', onMouseMove)
  window.addEventListener('click', onClick)
  if (isMobile && window.DeviceOrientationEvent) {
    window.addEventListener('deviceorientation', onDeviceOrientation)
  }
})

onUnmounted(() => {
  window.removeEventListener('mousemove', onMouseMove)
  window.removeEventListener('click', onClick)
  window.removeEventListener('deviceorientation', onDeviceOrientation)
  document.body.classList.remove('video-hover')

  // Dispose video textures and materials
  materials.value.forEach((mat) => {
    const tex = mat.uniforms.uTexture.value
    if (tex?.source?.data instanceof HTMLVideoElement) {
      tex.source.data.pause()
      tex.source.data.src = ''
    }
    tex?.dispose()
    mat.dispose()
  })
  glowMaterials.value.forEach((m) => m.dispose())
})

// Render loop
const { onBeforeRender } = useLoop()
let time = 0

onBeforeRender(({ delta }) => {
  time += delta

  if (!window.innerHeight) return

  const activeFraction = getActiveFraction(props.scrollY)

  if (groupRef.value) {
    const targetZ = (CAMERA_Z - VIEW_DIST) + activeFraction * STATION_SPACING

    groupRef.value.position.z = THREE.MathUtils.lerp(groupRef.value.position.z, targetZ, 0.1)
    groupRef.value.rotation.y = THREE.MathUtils.lerp(groupRef.value.rotation.y, targetRotation.value.y, 0.04)
    groupRef.value.rotation.x = THREE.MathUtils.lerp(groupRef.value.rotation.x, targetRotation.value.x, 0.04)
    groupRef.value.rotation.x += props.scrollVelocity * 0.0002
  }

  materials.value.forEach((mat, i) => {
    mat.uniforms.uTime.value = time
    mat.uniforms.uMouse.value.lerp(mouse.value, 0.05)

    const opacity = computeOpacity(activeFraction, i)
    mat.uniforms.uOpacity.value = opacity

    const glowMat = glowMaterials.value[i]
    if (glowMat) {
      const diff = activeFraction - i
      glowMat.opacity = diff > 0.3 ? 0 : (isMobile ? 0.01 : 0.03)
    }
  })

  // Raycasting for hover (desktop only)
  if (!isMobile && groupRef.value) {
    const camera = findCamera()
    if (camera) {
      raycaster.setFromCamera(ndcMouse, camera)
      const hits = raycaster.intersectObjects(findVideoMeshes())
      const newHover = hits.length > 0 ? hits[0].object.userData.videoIndex : -1

      if (newHover !== hoveredVideo) {
        if (hoveredVideo >= 0) {
          const mat = materials.value[hoveredVideo]
          if (mat) gsap.to(mat.uniforms.uHover, { value: 0, duration: 0.4, overwrite: true })
        }
        if (newHover >= 0) {
          const mat = materials.value[newHover]
          if (mat) gsap.to(mat.uniforms.uHover, { value: 1, duration: 0.4, overwrite: true })
          document.body.classList.add('video-hover')
        } else {
          document.body.classList.remove('video-hover')
        }
        hoveredVideo = newHover
      }
    }
  }
})

// Particles
const TOTAL_DEPTH = 4 * STATION_SPACING + 12

function hash(n: number): number {
  const s = Math.sin(n) * 43758.5453
  return s - Math.floor(s)
}

function generatePositions(count: number, spreadX: number, spreadY: number, seedX: number, seedY: number, seedZ: number): Float32Array {
  const arr = new Float32Array(count * 3)
  for (let i = 0; i < count; i++) {
    arr[i * 3] = (hash(i * seedX) - 0.5) * spreadX
    arr[i * 3 + 1] = (hash(i * seedY) - 0.5) * spreadY
    arr[i * 3 + 2] = -hash(i * seedZ) * TOTAL_DEPTH * 1.2
  }
  return arr
}

const smallCount = MOBILE_CHECK ? 400 : 1200
const medCount = MOBILE_CHECK ? 80 : 200
const largeCount = MOBILE_CHECK ? 25 : 60

const smallParticlePositions = generatePositions(smallCount, 30, 20, 1.17, 2.31, 3.73)
const medParticlePositions = generatePositions(medCount, 25, 16, 5.91, 7.43, 11.07)
const largeParticlePositions = generatePositions(largeCount, 22, 14, 13.37, 17.71, 23.31)

const planeSize: [number, number, number, number] = MOBILE_CHECK ? [2.8, 1.575, 32, 32] : [2.4, 1.35, 32, 32]
const glowSize: [number, number] = MOBILE_CHECK ? [3.2, 2] : [3, 2]
</script>

<template>
  <TresPerspectiveCamera :position="[0, 0, CAMERA_Z]" :fov="50" />
  <TresAmbientLight :intensity="0.6" />
  <TresPointLight :position="[5, 5, 5]" :intensity="0.8" />

  <TresGroup ref="groupRef">
    <template v-for="(c, i) in cases" :key="c.id">
      <TresMesh
        :position="videoPos(i)"
        :rotation="videoRot(i)"
        :user-data="{ videoIndex: i }"
      >
        <TresPlaneGeometry :args="planeSize" />
        <TresShaderMaterial
          v-if="materials[i]"
          :vertex-shader="materials[i].vertexShader"
          :fragment-shader="materials[i].fragmentShader"
          :uniforms="materials[i].uniforms"
          :transparent="true"
        />
      </TresMesh>

      <TresMesh
        v-if="glowMaterials[i]"
        :position="[videoPos(i)[0], videoPos(i)[1], videoPos(i)[2] - 0.1]"
        :rotation="videoRot(i)"
        :material="glowMaterials[i]"
      >
        <TresPlaneGeometry :args="glowSize" />
      </TresMesh>
    </template>

    <TresPoints>
      <TresBufferGeometry>
        <TresBufferAttribute attach="attributes-position" :count="smallCount" :array="smallParticlePositions" :item-size="3" />
      </TresBufferGeometry>
      <TresPointsMaterial :size="0.02" :color="0xc8ff00" :transparent="true" :opacity="0.4" :size-attenuation="true" />
    </TresPoints>

    <TresPoints>
      <TresBufferGeometry>
        <TresBufferAttribute attach="attributes-position" :count="medCount" :array="medParticlePositions" :item-size="3" />
      </TresBufferGeometry>
      <TresPointsMaterial :size="0.06" :color="0xc8ff00" :transparent="true" :opacity="0.35" :size-attenuation="true" />
    </TresPoints>

    <TresPoints>
      <TresBufferGeometry>
        <TresBufferAttribute attach="attributes-position" :count="largeCount" :array="largeParticlePositions" :item-size="3" />
      </TresBufferGeometry>
      <TresPointsMaterial :size="0.15" :color="0xc8ff00" :transparent="true" :opacity="0.3" :size-attenuation="true" />
    </TresPoints>
  </TresGroup>
</template>
