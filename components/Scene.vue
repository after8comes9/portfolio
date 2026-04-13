<script setup lang="ts">
import type { CaseData } from '~/composables/useCaseData'

const props = defineProps<{
  cases: CaseData[]
  scrollVelocity: number
  scrollY: number
}>()

const emit = defineEmits<{
  openVideo: [src: string]
}>()
</script>

<template>
  <TresCanvas
    clear-color="#0a0a0a"
    :alpha="false"
    window-size
    class="scene-canvas"
  >
    <SceneContent
      :cases="cases"
      :scroll-velocity="scrollVelocity"
      :scroll-y="scrollY"
      @open-video="(src: string) => emit('openVideo', src)"
    />
  </TresCanvas>
</template>

<style scoped>
.scene-canvas {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 1;
  pointer-events: auto;
  background: var(--color-bg);
  touch-action: pan-y;
}

@media (max-width: 768px) {
  .scene-canvas {
    pointer-events: none;
  }
}
</style>
