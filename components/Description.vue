<script setup>
const props = defineProps({
    food: Object
});
</script>

<template>
    <div class="p-4">
        <img :src="food.image_url" alt="">
        <p class="text-sm mt-4">{{ food.description }}</p>
        <p class="font-medium mt-4">{{ formatUZS(food.price) }} so'm</p>
        <p class="text-sm">{{ food.name }}</p>
        <p class="text-xs mt-1">{{ food.weight }} {{ food.weight_type }}</p>
    </div>
</template>



<style scoped></style>