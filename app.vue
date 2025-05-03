<template>
  <NuxtLayout>
    <UApp :locale="locales[locale]">
      <NuxtPage />
    </UApp>
  </NuxtLayout>
</template>

<script setup>
import * as locales from '@nuxt/ui/locale'
const { locale } = useI18n()
useHead({
  meta: [
    {
      name: 'viewport',
      content: 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no'
    }
  ]
});
onMounted(() => {
  ['gesturestart', 'gesturechange', 'gestureend'].forEach(event =>
    window.addEventListener(event, e => e.preventDefault())
  );
});
</script>