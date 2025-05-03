<script setup>
import { Description } from "#components";
import { useFoodStore } from "~/stores/food";
const store = useFoodStore();
const open = ref(false)
const props = defineProps(["food"]);

const selected = computed(() =>
  store.selectedFoods.find((f) => f.id === props.food.id)
);

const increment = () => store.addFood(props.food);
const decrement = () => store.decrementFood(props.food.id);

const formatUZS = (value) =>
  new Intl.NumberFormat("uz-UZ", {
    style: "currency",
    currency: "UZS",
    minimumFractionDigits: 0,
  }).format(value).replace("UZS", "").trim();
</script>

<template>
  <UCard class="h-full flex flex-col">
    <div class="flex flex-col h-full justify-between">

      <div class="aspect-[4/3] overflow-hidden rounded-xl mb-3" @click="open = true">
        <img :src="food.image_url" alt="Food image" class="object-cover w-full h-full" />
      </div>

      <div class="flex-1 mb-3" @click="open = true">
        <p class="font-semibold text-base line-clamp-1">{{ formatUZS(food.price) }} so'm</p>
        <p class="text-sm font-medium line-clamp-2">{{ food.name }}</p>
        <p class="text-xs text-gray-500 mt-1">{{ food.weight }} {{ food.weight_type }}</p>
      </div>

      <div class="btnn">
        <div v-if="selected"
          class="bg-secondary-500 w-full rounded-3xl px-5 h-9 text-white text-xl font-semibold flex items-center justify-between">
          <button @click="decrement" class="cursor-pointer">−</button>
          <span class="mx-2 text-base font-medium">{{ selected.count }}</span>
          <button @click="increment" class="cursor-pointer">+</button>
        </div>
        <div v-else @click="increment"
          class="bg-secondary-500 w-full rounded-3xl p-1 h-9 text-white text-xl font-semibold text-center cursor-pointer">
          +
        </div>
      </div>
    </div>
    <UDrawer v-model:open="open">
      <template #content>
        <Description :food="food" />
      </template>
    </UDrawer>
  </UCard>
</template>

<style scoped>
/* Matn uzun bo'lsa ham qatorni qisqartirish */
.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
