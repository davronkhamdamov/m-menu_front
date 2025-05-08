<script setup>
const props = defineProps({
    food: Object
});
const { t } = useI18n()
const weight_type = ref(props.food.weight_type)

const weightTypeObj = {
    g: t("gram"),
    kg: t("kilogram"),
    t: t("count"),
    l: t("litr")
}
function getWeightType() {
    return weightTypeObj[weight_type.value]
}
</script>

<template>
    <div class="p-4">
        <img :src="food.image_url" alt="" class="object-contain w-full h-72">
        <p class="text-sm mt-4">{{ food.description }}</p>
        <p class="font-medium mt-4">{{ formatUZS(food.price) }} so'm</p>
        <p class="text-sm">{{ food.name }}</p>
        <p class="text-xs mt-1">{{ food.weight }} {{ getWeightType() }}</p>
    </div>
</template>



<style scoped></style>