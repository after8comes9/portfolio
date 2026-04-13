<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import type { CaseData } from '~/composables/useCaseData'
import { computeOpacity, getActiveFraction } from '~/composables/useActiveFraction'

gsap.registerPlugin(ScrollTrigger)

const props = defineProps<{
  caseData: CaseData
  index: number
}>()

const sectionRef = ref<HTMLElement>()
const infoRef = ref<HTMLElement>()

const isEven = props.index % 2 === 0
let rafId: number | null = null

onMounted(() => {
  const mobile = window.innerWidth < 768

  if (mobile) {
    const info = infoRef.value!
    const index = props.index

    function update() {
      const af = getActiveFraction(window.scrollY)
      const opacity = computeOpacity(af, index)
      const diff = af - index
      const y = diff * 60

      gsap.set(info, { y, opacity })
      rafId = requestAnimationFrame(update)
    }

    rafId = requestAnimationFrame(update)
  } else {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.value,
        start: 'top 65%',
        end: 'bottom 10%',
        scrub: 0.6,
      },
    })

    tl.fromTo(infoRef.value!, { y: 80, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4 })
      .to({}, { duration: 0.3 })
      .to(infoRef.value!, { y: -60, opacity: 0, duration: 0.3 })
  }
})

onUnmounted(() => {
  if (rafId !== null) cancelAnimationFrame(rafId)
})
</script>

<template>
  <section
    ref="sectionRef"
    class="case"
    :class="{ 'case--right': !isEven }"
  >
    <div ref="infoRef" class="case__info" :class="{ 'case__info--align-right': isEven }">
      <span class="case__number" :style="{ color: caseData.color }">
        {{ String(caseData.id).padStart(2, '0') }}
      </span>
      <div class="case__line" :style="{ background: caseData.color }" />
      <h2 class="case__title">{{ caseData.title }}</h2>
      <p class="case__subtitle">{{ caseData.subtitle }}</p>
    </div>
  </section>
</template>

<style scoped>
.case {
  height: 100vh;
  display: flex;
  align-items: center;
  padding: 4rem;
  padding-left: 12%;
  position: relative;
}

.case--right {
  justify-content: flex-end;
  padding-left: 4rem;
  padding-right: 12%;
}

.case__info {
  max-width: 340px;
  pointer-events: auto;
}

.case__info--align-right {
  text-align: right;
}

.case__info--align-right .case__line {
  margin-left: auto;
}

.case__number {
  font-family: var(--font-mono);
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-weight: 700;
  line-height: 1;
  display: block;
}

.case__line {
  width: 50px;
  height: 2px;
  margin: 1rem 0;
}

.case__title {
  font-size: clamp(1.75rem, 4vw, 3rem);
  font-weight: 700;
  letter-spacing: -0.02em;
  line-height: 1.1;
  margin-bottom: 0.6rem;
}

.case__subtitle {
  font-size: clamp(0.9rem, 1.3vw, 1.05rem);
  color: var(--color-muted);
  line-height: 1.5;
  margin-bottom: 0.4rem;
}

@media (max-width: 768px) {
  .case,
  .case--right {
    justify-content: center;
    align-items: flex-start;
    padding: 10vh 2rem 2rem;
  }

  .case__info,
  .case__info--align-right {
    text-align: center;
  }

  .case__line,
  .case__info--align-right .case__line {
    margin-left: auto;
    margin-right: auto;
  }
}
</style>
