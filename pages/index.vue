<script setup lang="ts">
import { ref } from 'vue'
import { useScrollProgress } from '~/composables/useScrollProgress'
import { useCaseData } from '~/composables/useCaseData'

const { scrollVelocity, scrollY } = useScrollProgress()
const cases = useCaseData()
const activeVideo = ref<string | null>(null)

function openVideo(src: string) {
  activeVideo.value = src
}

function closeVideo() {
  activeVideo.value = null
}
</script>

<template>
  <div class="page">
    <!-- 3D Scene — videos + particles -->
    <ClientOnly>
      <Scene
        :cases="cases"
        :scroll-velocity="scrollVelocity"
        :scroll-y="scrollY"
        @open-video="openVideo"
      />
    </ClientOnly>

    <!-- Custom cursor -->
    <ClientOnly>
      <CustomCursor />
    </ClientOnly>

    <!-- Film grain overlay -->
    <GrainOverlay />

    <!-- Video modal -->
    <ClientOnly>
      <VideoModal :src="activeVideo" @close="closeVideo" />
    </ClientOnly>

    <!-- DOM content layer — text over 3D -->
    <div class="content">
      <HeroSection />

      <IntroSection />

      <h2 class="section-title">Selected Work</h2>

      <CaseSection
        v-for="(c, i) in cases"
        :key="c.id"
        :case-data="c"
        :index="i"
      />

      <TimelineSection />

      <FooterSection />
    </div>
  </div>
</template>

<style scoped>
.page {
  position: relative;
}

.content {
  position: relative;
  z-index: 2;
  pointer-events: none;
}

@media (max-width: 768px) {
  .content {
    pointer-events: auto;
  }
}

.section-title {
  font-size: clamp(2rem, 6vw, 5rem);
  font-weight: 700;
  letter-spacing: -0.03em;
  text-align: center;
  padding: 3rem 2rem 2rem;
  position: relative;
  z-index: 2;
}

@media (max-width: 768px) {
  .section-title {
    padding: 4rem 1.5rem 2rem;
  }
}

.content :deep(a),
.content :deep(button),
.content :deep([data-cursor-hover]) {
  pointer-events: auto;
}
</style>
