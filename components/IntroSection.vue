<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const sectionRef = ref<HTMLElement>()
const titleRef = ref<HTMLElement>()
const textRef = ref<HTMLElement>()

onMounted(() => {
  const section = sectionRef.value!

  gsap.from(titleRef.value!, {
    y: 40,
    opacity: 0,
    duration: 0.8,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: section,
      start: 'top 70%',
    },
  })

  gsap.from(textRef.value!, {
    y: 30,
    opacity: 0,
    duration: 0.8,
    delay: 0.15,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: section,
      start: 'top 70%',
    },
  })
})

onUnmounted(() => {
  ScrollTrigger.getAll()
    .filter((t) => t.vars.trigger === sectionRef.value)
    .forEach((t) => t.kill())
})
</script>

<template>
  <section ref="sectionRef" class="intro">
    <div class="intro__inner">
      <h2 ref="titleRef" class="intro__title">Bridging the gap between concept and code.</h2>
      <p ref="textRef" class="intro__text">
        A background in concept creation taught me how to think creatively and shape ideas visually. A growing fascination with technology led me to learn how to build them. Now the thinking and the making come together, creating digital experiences where creativity and technology go hand in hand.
      </p>
    </div>
  </section>
</template>

<style scoped>
.intro {
  min-height: 85vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 2;
  padding: 4rem;
}

.intro__inner {
  max-width: 600px;
}

.intro__title {
  font-size: clamp(1.5rem, 3vw, 2.2rem);
  font-weight: 700;
  letter-spacing: -0.02em;
  line-height: 1.2;
  margin-bottom: 1.5rem;
  color: var(--color-accent);
}

.intro__text {
  font-size: clamp(0.95rem, 1.3vw, 1.1rem);
  line-height: 1.8;
  color: rgba(240, 237, 230, 0.75);
}

@media (max-width: 768px) {
  .intro {
    min-height: 60vh;
    padding: 3rem 2rem;
  }

  .intro__text {
    font-size: 0.95rem;
  }
}
</style>
