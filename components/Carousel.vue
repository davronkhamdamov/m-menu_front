<script setup>
import { it } from '@nuxt/ui/runtime/locale/index.js';
import FoodCard from './FoodCard.vue';
const items = ref([])

onMounted( async () => {
    const data  = await useApiFetch('/v1/common_food')
    items.value = data.data
    
})

</script>

<template>
    <div class="my-8">
        <UCarousel v-slot="{ item }" :items="items" loop arrows dots :autoplay="{ delay: 2000 }"
            :ui="{ item: 'basis-1/2' }">
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