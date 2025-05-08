<script setup>
import { useFoodStore } from '~/stores/food'

const store = useFoodStore()
const { t } = useI18n()

const weightTypeObj = {
  g: t("gram"),
  kg: t("kilogram"),
  t: t("count"),
  l: t("litr")
}

</script>

<template>
  <div v-for="food in store.selectedFoods" :key="food.id"
    :class="store.counter ? 'flex items-center gap-1 my-10 justify-around' : 'flex items-center gap-1 my-10 justify-between'">
    <div class="w-20 h-20 overflow-hidden rounded-xl mb-3 bg-center relative" @click="open = true">
      <div class="absolute inset-0 bg-cover bg-center blur-2xl scale-125 z-0"
        :style="{ backgroundImage: `url(${food.image_url})` }"></div>
      <img :src="food.image_url" alt="Food image"
        class="object-contain w-full h-full relative z-1 shadow-2xl shadow-white" />
    </div>
    <div class="flex flex-wrap gap-2 w-1/2 content-center">
      <p class="text-xs">{{ food.name }}</p>
      <p class="text-xs font-medium">{{ formatUZS(food.price) }} so'm</p>
      <p class="text-xs text-gray-400">{{ food.weight }} {{ weightTypeObj[food.weight_type] }}</p>
    </div>
    <div v-if="!store.counter"
      class="bg-secondary-500 w-[30%] rounded-xl px-4 py-1 font-semibold flex items-center justify-between">
      <button @click="store.decrementFood(food.id)" class="cursor-pointer">-</button>
      <span class="mx-2 text-xs font-medium">{{ food.count }}</span>
      <button @click="store.addFood(food)" class="cursor-pointer">+</button>
    </div>
    <div v-else class="w-[30%]"></div>
  </div>
</template>
