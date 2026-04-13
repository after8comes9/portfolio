<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const canvasRef = ref<HTMLCanvasElement>()
let rafId: number

onMounted(() => {
  const canvas = canvasRef.value!
  const ctx = canvas.getContext('2d')!

  canvas.width = 64
  canvas.height = 64

  let lastUpdate = 0
  const interval = 1000 / 20 // 20fps

  function draw(now: number) {
    if (now - lastUpdate >= interval) {
      lastUpdate = now
      const imageData = ctx.createImageData(64, 64)
      const data = imageData.data
      for (let i = 0; i < data.length; i += 4) {
        const v = Math.random() * 120
        data[i] = v
        data[i + 1] = v
        data[i + 2] = v
        data[i + 3] = 2
      }
      ctx.putImageData(imageData, 0, 0)
    }
    rafId = requestAnimationFrame(draw)
  }

  rafId = requestAnimationFrame(draw)
})

onUnmounted(() => {
  cancelAnimationFrame(rafId)
})
</script>

<template>
  <canvas ref="canvasRef" class="grain" />
</template>

<style scoped>
.grain {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 9998;
  pointer-events: none;
  image-rendering: pixelated;
}
</style>
