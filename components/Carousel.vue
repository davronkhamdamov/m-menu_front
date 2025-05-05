<script setup>
import FoodCard from './FoodCard.vue';
const items = ref([])
const { locale } = useI18n()

onMounted(async () => {
    const data = await useApiFetch('/v1/common_food', locale.value)
    items.value = data.data
})

</script>

<template>
    <div class="my-8" v-if="items.length >= 3">
        <h1 class="font-bold text-2xl">{{ $t("recently_bought_foods") }}</h1>
        <UCarousel v-slot="{ item }" :items="items" loop arrows dots :autoplay="{ delay: 2500 }"
            :ui="{ item: 'basis-1/2' }" class="rounded-4xl">
            <div class="h-full">
                <FoodCard :food="item" />
            </div>
        </UCarousel>

        <div v-if="error" class="text-red-500 mt-4">
            Xatolik yuz berdi: {{ error.message }}
        </div>
    </div>
</template>



<style scoped></style>