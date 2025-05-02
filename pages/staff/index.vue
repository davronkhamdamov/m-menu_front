<template>
    <UContainer>
        <h1 class="text-3xl my-5 font-bold">Buyurtmalar ro'yhati:</h1>
        <Orders />
    </UContainer>
</template>
<script setup>

definePageMeta({
    middleware: 'auth'
})
</script>