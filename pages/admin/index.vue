<template>
    <div class="flex flex-col items-center justify-center min-h-screen">
        <svg class="animate-spin h-8 w-8 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
        </svg>
        <p>Redirecting to your dashboard...</p>
    </div>
</template>

<script setup>
definePageMeta({
    layout: false
})

const router = useRouter()
const { locale } = useI18n()

onMounted(() => {
    router.push(`/${locale.value}/admin/dashboard`)
})
</script>
