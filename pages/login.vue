<template>
    <UCard class="min-h-screen flex items-center justify-center">
        <form @submit.prevent="login" class="p-6 rounded w-96 space-y-4">
            <h2 class="text-2xl font-bold mb-4">Admin sifatida kirish</h2>
            <p class="text-red-500">{{ error }}</p>
            <input v-model="username" placeholder="Username" class="w-full border p-2 rounded" />
            <input v-model="password" type="password" placeholder="Parol" class="w-full border p-2 rounded" />
            <UButton type="submit" class="w-full flex items-center justify-center" label="Kirish" />
        </form>
    </UCard>
</template>

<script setup>
const username = ref('')
const password = ref('')
const error = ref('')
const router = useRouter()
const { locale } = useI18n()
const config = useRuntimeConfig();
const baseURL = config.public.apiBaseUrl;
const login = async () => {
    error.value = ''
    const { data, error: fetchError } = await useFetch(baseURL + '/v1/login', {
        method: 'POST',
        body: { login: username.value, password: password.value }
    })

    if (fetchError.value) {
        error.value = "Username yoki parol xato!"
        return
    }
    const token = data.value?.data.token

    if (token) {
        localStorage.setItem('token', token)
    }
    if (data.value.data.role == "Staff") {
        router.push(`/${locale.value}/staff`)
    } else if (data.value.data.role == "Admin") {
        router.push(`/${locale.value}/admin/dashboard`)
    }
}
</script>