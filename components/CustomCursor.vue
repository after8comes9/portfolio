<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'

const cursorOuter = ref<HTMLElement>()
const cursorInner = ref<HTMLElement>()
const boundElements = new WeakSet<Element>()
let observer: MutationObserver | null = null

function onMouseMove(e: MouseEvent) {
  gsap.to(cursorInner.value!, {
    x: e.clientX,
    y: e.clientY,
    duration: 0.1,
    ease: 'power2.out',
  })

  gsap.to(cursorOuter.value!, {
    x: e.clientX,
    y: e.clientY,
    duration: 0.35,
    ease: 'power2.out',
  })
}

function onMouseEnterInteractive() {
  gsap.to(cursorOuter.value!, { scale: 2.5, opacity: 0.3, duration: 0.3 })
  gsap.to(cursorInner.value!, { scale: 0.5, duration: 0.3 })
}

function onMouseLeaveInteractive() {
  gsap.to(cursorOuter.value!, { scale: 1, opacity: 1, duration: 0.3 })
  gsap.to(cursorInner.value!, { scale: 1, duration: 0.3 })
}

function bindInteractiveElements() {
  document.querySelectorAll('a, button, [data-cursor-hover]').forEach((el) => {
    if (boundElements.has(el)) return
    boundElements.add(el)
    el.addEventListener('mouseenter', onMouseEnterInteractive)
    el.addEventListener('mouseleave', onMouseLeaveInteractive)
  })
}

let debounceId: number | null = null

function debouncedBind() {
  if (debounceId) clearTimeout(debounceId)
  debounceId = window.setTimeout(bindInteractiveElements, 200)
}

onMounted(() => {
  window.addEventListener('mousemove', onMouseMove)
  bindInteractiveElements()

  observer = new MutationObserver(debouncedBind)
  observer.observe(document.body, { childList: true, subtree: true })
})

onUnmounted(() => {
  window.removeEventListener('mousemove', onMouseMove)
  if (debounceId) clearTimeout(debounceId)
  observer?.disconnect()
})
</script>

<template>
  <div class="cursor-container">
    <div ref="cursorOuter" class="cursor cursor--outer" />
    <div ref="cursorInner" class="cursor cursor--inner" />
  </div>
</template>

<style scoped>
.cursor-container {
  pointer-events: none;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 9999;
  mix-blend-mode: difference;
}

.cursor {
  position: fixed;
  border-radius: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none;
}

.cursor--outer {
  width: 40px;
  height: 40px;
  border: 1px solid var(--color-accent);
}

.cursor--inner {
  width: 8px;
  height: 8px;
  background: var(--color-accent);
}

@media (pointer: coarse) {
  .cursor-container {
    display: none;
  }
}
</style>
