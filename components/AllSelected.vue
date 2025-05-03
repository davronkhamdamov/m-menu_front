<script setup>
import { useFoodStore } from '~/stores/food'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const store = useFoodStore()
</script>

<template>
    <div class="bg-secondary-500 rounded-2xl flex items-center justify-between h-12 px-3">
        <p class="w-1/3 flex">5-10 {{ t('minute') }}</p>
        <p class="w-1/3 flex justify-center text-sm font-semibold">{{ t('next') }}</p>
        <p class="w-1/3 flex justify-end text-sm">{{ formatUZS(store.totalPrice) }} so'm</p>
    </div>
</template>
