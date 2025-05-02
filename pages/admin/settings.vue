<template>
    <div>
        <h2 class="text-2xl font-bold mb-8">{{ $t("settings") }}</h2>
        <div class="flex flex-col gap-8">
            <div class="flex justify-between items-center">
                <p>{{ $t('chooseTheme') }}</p>
                <USelect v-model="theme" :default-value="theme" :items="items" class="w-48" />
            </div>
            <div class="flex justify-between items-center">
                <p>{{ $t('chooseLanguage') }}</p>
                <USelect v-model="language" :items="languages" class="w-48"
                    :icon="languages.find(e => e.value == language).icon" />
            </div>
        </div>
        <br>
        <p>{{ $t('adminSettingsComingSoon') }}</p>
    </div>
</template>

<script setup>
const { colorMode, applyTheme } = useTheme()
const { setLocale, locale } = useI18n()

const theme = ref();
const language = ref("uz");

onMounted(() => {
    theme.value = colorMode.value
    language.value = locale.value
})
const items = [
    { label: 'Light', value: 'light' },
    { label: 'Dark', value: 'dark' },
    { label: 'System', value: 'system' },
];

watch(language, (value) => {
    setLocale(value)
    language.value = value
})

const languages = [
    { label: 'O\'zbek', value: 'uz', icon: "twemoji:flag-uzbekistan" },
    { label: 'Русский', value: 'ru', icon: "twemoji:flag-russia" },
    { label: 'English', value: 'en', icon: "emojione-v1:flag-for-united-kingdom" },
];

watch(theme, (newValue) => {
    applyTheme(newValue)
})

definePageMeta({
    layout: 'admin'
})


</script>
