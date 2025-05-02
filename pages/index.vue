
<template>
  <UContainer>
   
    <div v-if="state" class="flex flex-col items-center justify-center min-h-screen">
    <svg class="animate-spin h-8 w-8 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
    </svg>
    <p>Redirecting to your dashboard...</p>
  </div>
  <div v-else class="flex flex-col items-center justify-center min-h-screen gap-5 text-center text-xl">
    <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 48 48">
      <path fill="none" stroke="red" stroke-linecap="round" stroke-linejoin="round" stroke-width="4"
        d="m6 11l5-5l13 13L37 6l5 5l-13 13l13 13l-5 5l-13-13l-13 13l-5-5l13-13z" clip-rule="evenodd" />
    </svg>
    <p>Siz stoldagi QR kodni skaner qilmagan ko'rinasiz!</p>
    <p>Iltimos QR kodni skaner qiling bu sizni qaysi stoldan foydalanayotganizni aniqlashimizda yordam beradi. 😊</p>
  </div>
  </UContainer>
</template>

<script setup>
definePageMeta({
    layout: false
})


</script>
