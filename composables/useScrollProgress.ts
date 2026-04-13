import { ref, onMounted, onUnmounted } from 'vue'
import Lenis from 'lenis'

const scrollVelocity = ref(0)
const scrollY = ref(0)
let lenis: Lenis | null = null
let rafId: number | null = null

export function useScrollProgress() {
  onMounted(() => {
    if (lenis) return

    lenis = new Lenis({
      duration: 1.4,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 2,
    })

    lenis.on('scroll', (e: any) => {
      scrollVelocity.value = e.velocity
      scrollY.value = e.scroll
    })

    function raf(time: number) {
      lenis!.raf(time)
      rafId = requestAnimationFrame(raf)
    }

    rafId = requestAnimationFrame(raf)
  })

  onUnmounted(() => {
    if (rafId) cancelAnimationFrame(rafId)
    if (lenis) {
      lenis.destroy()
      lenis = null
    }
  })

  return { scrollVelocity, scrollY }
}
