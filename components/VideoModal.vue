<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'
import gsap from 'gsap'

const props = defineProps<{
  src: string | null
}>()

const emit = defineEmits<{
  close: []
}>()

const overlayRef = ref<HTMLElement>()
const videoRef = ref<HTMLVideoElement>()

watch(() => props.src, async (newSrc) => {
  if (newSrc) {
    await nextTick()
    gsap.fromTo(overlayRef.value!, { opacity: 0 }, { opacity: 1, duration: 0.3 })
    overlayRef.value?.focus()
    if (videoRef.value) {
      videoRef.value.currentTime = 0
      videoRef.value.play()
    }
  }
})

function close() {
  gsap.to(overlayRef.value!, {
    opacity: 0,
    duration: 0.25,
    onComplete: () => emit('close'),
  })
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') close()
}
</script>

<template>
  <Teleport to="body">
    <div
      v-if="src"
      ref="overlayRef"
      class="modal"
      @click.self="close"
      @keydown="onKeydown"
      tabindex="0"
    >
      <button class="modal__close" @click="close" data-cursor-hover>&times;</button>
      <video
        ref="videoRef"
        :src="src"
        controls
        autoplay
        class="modal__video"
      />
    </div>
  </Teleport>
</template>

<style scoped>
.modal {
  position: fixed;
  inset: 0;
  z-index: 10000;
  background: rgba(0, 0, 0, 0.92);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  cursor: none;
}

.modal__video {
  max-width: 90vw;
  max-height: 85vh;
  border-radius: 4px;
  outline: none;
}

.modal__close {
  position: absolute;
  top: 1.5rem;
  right: 2rem;
  background: none;
  border: none;
  color: var(--color-text);
  font-size: 2rem;
  cursor: none;
  opacity: 0.6;
  transition: opacity 0.2s;
  line-height: 1;
}

.modal__close:hover {
  opacity: 1;
}

@media (max-width: 768px) {
  .modal {
    padding: 1rem;
    cursor: auto;
  }

  .modal__video {
    max-width: 100vw;
    max-height: 80vh;
  }

  .modal__close {
    cursor: auto;
  }
}
</style>
