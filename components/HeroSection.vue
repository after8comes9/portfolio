<script setup lang="ts">
import { ref, onMounted } from 'vue'
import gsap from 'gsap'

const titleChars = ref<HTMLElement[]>([])
const subtitle = ref<HTMLElement>()
const scrollCue = ref<HTMLElement>()

const words = ['Stijn', '\u00A0', 'de\u00A0Schryver']
const wordChars = words.map(w => w.split(''))
const allChars = wordChars.flat()

function setTitleRef(el: any, index: number) {
  if (el) titleChars.value[index] = el
}

onMounted(() => {
  const tl = gsap.timeline({ delay: 0.3 })

  tl.from(titleChars.value, {
    y: 120,
    rotateX: -90,
    opacity: 0,
    duration: 1,
    ease: 'power4.out',
    stagger: 0.04,
  })

  tl.from(
    subtitle.value!,
    {
      y: 30,
      opacity: 0,
      duration: 0.8,
      ease: 'power3.out',
    },
    '-=0.4'
  )

  tl.from(
    scrollCue.value!,
    {
      opacity: 0,
      duration: 1,
      ease: 'power2.out',
    },
    '-=0.2'
  )

  // Scroll cue pulse
  gsap.to(scrollCue.value!, {
    y: 10,
    repeat: -1,
    yoyo: true,
    duration: 1.2,
    ease: 'power1.inOut',
  })
})
</script>

<template>
  <section class="hero">
    <div class="hero__content">
      <h1 class="hero__title">
        <span
          v-for="(word, wi) in wordChars"
          :key="wi"
          class="hero__word"
        ><span
            v-for="(char, ci) in word"
            :key="ci"
            :ref="(el) => setTitleRef(el, wordChars.slice(0, wi).reduce((a, w) => a + w.length, 0) + ci)"
            class="hero__char"
          >{{ char }}</span></span>
      </h1>
      <p ref="subtitle" class="hero__subtitle">Creative Technologist</p>
    </div>
    <div ref="scrollCue" class="hero__scroll-cue">
      <span class="hero__scroll-text">Scroll</span>
      <div class="hero__scroll-line" />
    </div>
  </section>
</template>

<style scoped>
.hero {
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
  z-index: 2;
}

.hero__content {
  text-align: center;
  perspective: 600px;
}

.hero__title {
  font-size: clamp(4rem, 12vw, 10rem);
  font-weight: 700;
  letter-spacing: -0.03em;
  line-height: 1;
  overflow: hidden;
  padding-bottom: 0.1em;
}

.hero__word {
  display: inline-block;
  white-space: nowrap;
}

.hero__char {
  display: inline-block;
  will-change: transform, opacity;
}

.hero__subtitle {
  font-family: var(--font-mono);
  font-size: clamp(0.875rem, 1.5vw, 1.125rem);
  color: var(--color-accent);
  margin-top: 1rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.hero__scroll-cue {
  position: absolute;
  bottom: 3rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.hero__scroll-text {
  font-family: var(--font-mono);
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  color: var(--color-muted);
}

.hero__scroll-line {
  width: 1px;
  height: 40px;
  background: linear-gradient(to bottom, var(--color-muted), transparent);
}

@media (max-width: 768px) {
  .hero__content {
    padding: 0 1rem;
  }

  .hero__subtitle {
    font-size: 0.75rem;
  }
}
</style>
