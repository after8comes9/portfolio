<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const footerRef = ref<HTMLElement>()
const titleRef = ref<HTMLElement>()
const linksRef = ref<HTMLElement>()
const currentYear = new Date().getFullYear()

onMounted(() => {
  gsap.from(titleRef.value!, {
    y: 80,
    opacity: 0,
    duration: 1,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: footerRef.value,
      start: 'top 80%',
    },
  })

  gsap.from(linksRef.value!, {
    y: 40,
    opacity: 0,
    duration: 0.8,
    delay: 0.2,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: footerRef.value,
      start: 'top 80%',
    },
  })
})

onUnmounted(() => {
  ScrollTrigger.getAll()
    .filter((t) => t.vars.trigger === footerRef.value)
    .forEach((t) => t.kill())
})
</script>

<template>
  <footer ref="footerRef" class="footer">
    <h2 ref="titleRef" class="footer__title">Contact me</h2>
    <div ref="linksRef" class="footer__links">
      <a href="mailto:stijndeschryver@icloud.com" class="footer__link" data-cursor-hover>
        <Icon name="mdi:email-outline" size="32" />
      </a>
      <a href="https://www.linkedin.com/in/stijndeschryver/" target="_blank" rel="noopener" class="footer__link" data-cursor-hover>
        <Icon name="mdi:linkedin" size="32" />
      </a>
    </div>
    <p class="footer__copy">&copy; {{ currentYear }} Stijn de Schryver</p>
  </footer>
</template>

<style scoped>
.footer {
  min-height: 60vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: 4rem;
  position: relative;
  z-index: 2;
}

.footer__title {
  font-size: clamp(2.5rem, 8vw, 7rem);
  font-weight: 700;
  letter-spacing: -0.03em;
  line-height: 1.05;
  margin-bottom: 2rem;
}

.footer__links {
  display: flex;
  gap: 1.5rem;
  margin-bottom: 3rem;
}

.footer__link {
  color: var(--color-text);
  transition: color 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.footer__link:hover {
  color: var(--color-accent);
}

.footer__copy {
  font-family: var(--font-mono);
  font-size: 0.7rem;
  color: var(--color-muted);
  letter-spacing: 0.1em;
}
</style>
