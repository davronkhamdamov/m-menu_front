<script setup>
import { useI18n } from 'vue-i18n'
import { ref, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useFoodStore } from '~/stores/food'
import Carousel from '~/components/Carousel.vue'

const { setLocale, locale } = useI18n()

const language = ref(locale.value)

const languages = [
    { label: 'O\'zbek', value: 'uz', icon: "twemoji:flag-uzbekistan" },
    { label: 'Русский', value: 'ru', icon: "twemoji:flag-russia" },
    { label: 'English', value: 'en', icon: "emojione-v1:flag-for-united-kingdom" },
]

watch(language, (value) => {
    setLocale(value)
    foodStore.fetchFoods(locale.value)
})

const foodStore = useFoodStore()
const route = useRoute()
const tableId = route.params.id
foodStore.tableId = tableId

onMounted(async () => {
    await foodStore.fetchFoods(locale.value)
})
definePageMeta({
    layout: false
})
</script>
<template>
    <UContainer>
        <div class="flex justify-between items-center p-3  shadow-2xl">
            <h3>M Menu</h3>
            <USelect v-model="language" :items="languages" class=""
                :icon="languages.find(e => e.value == language).icon" />
        </div>
        <Carousel />
        <div v-if="foodStore.isLoading" class="p-4">Loading...</div>
        <div v-else class="last:mb-15">
            <div class="last:mb-10" v-for="category in foodStore.foods" :key="category.id">
                <h2>{{ category.name }}</h2>
                <div class="grid grid-cols-2 gap-4 lg:grid-cols-4 mt-4">
                    <FoodCard v-for="food in category.foods" :key="food.id" :food="food" />
                </div>
            </div>

        </div>
        <div class="fixed bottom-5 w-[95%] left-1/2 -translate-x-1/2">
            <NuxtLink to="/order" v-if="foodStore.totalPrice">
                <AllSelected class="w-full" />
            </NuxtLink>
        </div>
    </UContainer>
</template>
