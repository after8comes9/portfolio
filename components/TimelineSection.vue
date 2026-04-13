<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

interface TimelineEntry {
  year: string
  role: string
  company: string
  description: string
  accent: string
}

const sectionRef = ref<HTMLElement>()
const headingRef = ref<HTMLElement>()
const lineRef = ref<HTMLElement>()
const entryRefs = ref<HTMLElement[]>([])

const timeline: TimelineEntry[] = [
  {
    year: '2015',
    role: 'Creative Intern',
    company: 'BBDO',
    description: 'First steps into the world of advertising and concept-driven creative work.',
    accent: '#c8ff00',
  },
  {
    year: '2015 — 2019',
    role: 'Concept Creator / Art Director',
    company: 'Publicis Groupe',
    description: 'Developed concepts and shaped visual direction across Saatchi & Saatchi, Leo Burnett, Digitas, and Publicis. A growing fascination with digital led me to gradually shift toward digital-first campaigns.',
    accent: '#00d4ff',
  },
  {
    year: '2019 — 2020',
    role: 'Concept Creator / Art Director',
    company: 'Havas',
    description: 'Moved here to go deeper into digital, drawn by their ambition to strengthen their tech and digital expertise.',
    accent: '#ff6b35',
  },
  {
    year: '2021 — 2023',
    role: 'Concept Creator / Art Director',
    company: 'IO',
    description: 'Working closely with in-house developers deepened my interest in the tech side and what\'s really possible. I started to see how valuable it is to understand both the creative and the technical.',
    accent: '#bf5af2',
  },
  {
    year: '2023 — 2024',
    role: 'The Pivot',
    company: '',
    description: 'Decided to bridge the gap between concept and code. Learned to develop, then sharpened those skills at nocomputer, a studio that builds award-winning digital experiences for ad agencies across Belgium.',
    accent: '#f5f5f5',
  },
  {
    year: '2024 — Now',
    role: 'Creative Technologist & Developer',
    company: 'AdSomeNoise',
    description: 'The full picture. From brief to delivery, concept to code. Involved in every step of building digital experiences where creativity and technology go hand in hand.',
    accent: '#c8ff00',
  },
]

function setEntryRef(el: any, i: number) {
  if (el) entryRefs.value[i] = el
}

onMounted(() => {
  const toggleActions = 'play reverse play reverse'

  // Heading animation
  gsap.from(headingRef.value!, {
    y: 60,
    opacity: 0,
    duration: 1,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: sectionRef.value,
      start: 'top 75%',
      toggleActions,
    },
  })

  // Line draw
  gsap.from(lineRef.value!, {
    scaleY: 0,
    duration: 1.5,
    ease: 'power2.inOut',
    scrollTrigger: {
      trigger: sectionRef.value,
      start: 'top 60%',
      toggleActions,
    },
  })

  // Staggered entries
  entryRefs.value.forEach((entry, i) => {
    const isLeft = i % 2 === 0

    gsap.from(entry, {
      x: isLeft ? -80 : 80,
      opacity: 0,
      duration: 0.8,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: entry,
        start: 'top 80%',
        toggleActions,
      },
    })

    // Dot scale
    const dot = entry.querySelector('.timeline__dot')
    if (dot) {
      gsap.from(dot, {
        scale: 0,
        duration: 0.4,
        ease: 'back.out(2)',
        scrollTrigger: {
          trigger: entry,
          start: 'top 78%',
          toggleActions,
        },
      })
    }
  })
})

onUnmounted(() => {
  ScrollTrigger.getAll()
    .filter((t) => t.vars.trigger === sectionRef.value || entryRefs.value.includes(t.vars.trigger as HTMLElement))
    .forEach((t) => t.kill())
})
</script>

<template>
  <section ref="sectionRef" class="timeline-section">
    <h2 ref="headingRef" class="timeline__heading">My Journey</h2>

    <div class="timeline">
      <div ref="lineRef" class="timeline__line" />

      <div
        v-for="(entry, i) in timeline"
        :key="entry.year"
        :ref="(el) => setEntryRef(el, i)"
        class="timeline__entry"
        :class="{ 'timeline__entry--right': i % 2 !== 0 }"
      >
        <div class="timeline__dot" :style="{ background: entry.accent }" />
        <div class="timeline__card">
          <span class="timeline__year" :style="{ color: entry.accent }">
            {{ entry.year }}
          </span>
          <h3 class="timeline__role">
            {{ entry.role }}
            <span v-if="entry.company" class="timeline__company">
              {{ entry.company }}
            </span>
          </h3>
          <p class="timeline__description">{{ entry.description }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.timeline-section {
  position: relative;
  z-index: 2;
  padding: 8rem 2rem;
  max-width: 1000px;
  margin: 0 auto;
}

.timeline__heading {
  font-size: clamp(2.5rem, 6vw, 5rem);
  font-weight: 700;
  letter-spacing: -0.03em;
  text-align: center;
  margin-bottom: 5rem;
}

.timeline {
  position: relative;
}

.timeline__line {
  position: absolute;
  left: 50%;
  top: 0;
  bottom: 0;
  width: 1px;
  background: linear-gradient(
    to bottom,
    transparent,
    var(--color-muted) 10%,
    var(--color-muted) 90%,
    transparent
  );
  transform-origin: top;
}

.timeline__entry {
  position: relative;
  width: 50%;
  padding: 0 3rem 4rem 0;
  display: flex;
  justify-content: flex-end;
}

.timeline__entry--right {
  margin-left: 50%;
  padding: 0 0 4rem 3rem;
  justify-content: flex-start;
}

.timeline__dot {
  position: absolute;
  right: -6px;
  top: 0.5rem;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  z-index: 2;
  box-shadow: 0 0 20px currentColor;
}

.timeline__entry--right .timeline__dot {
  left: -6px;
  right: auto;
}

.timeline__card {
  max-width: 380px;
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 8px;
  backdrop-filter: blur(10px);
  transition: border-color 0.3s ease, background 0.3s ease;
}

.timeline__card:hover {
  border-color: rgba(255, 255, 255, 0.12);
  background: rgba(255, 255, 255, 0.05);
}

.timeline__year {
  font-family: var(--font-mono);
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.15em;
  text-transform: uppercase;
}

.timeline__role {
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0.5rem 0;
  line-height: 1.3;
}

.timeline__company {
  display: block;
  font-family: var(--font-mono);
  font-size: 0.75rem;
  font-weight: 400;
  color: var(--color-muted);
  letter-spacing: 0.1em;
  text-transform: uppercase;
  margin-top: 0.15rem;
}

.timeline__description {
  font-size: 0.9rem;
  line-height: 1.6;
  color: rgba(240, 237, 230, 0.7);
}

/* Mobile: single column */
@media (max-width: 768px) {
  .timeline__line {
    left: 16px;
  }

  .timeline__entry,
  .timeline__entry--right {
    width: 100%;
    margin-left: 0;
    padding: 0 0 3rem 3rem;
    justify-content: flex-start;
  }

  .timeline__dot,
  .timeline__entry--right .timeline__dot {
    left: 10px;
    right: auto;
  }
}
</style>
