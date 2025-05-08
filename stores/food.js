import { defineStore } from "pinia";
import { ref, computed } from "vue";

export const useFoodStore = defineStore("foodStore", () => {
  const foods = ref([]);
  const selectedFoods = ref([]);
  const tableId = ref(null);
  const counter = ref(false);
  const isLoading = ref(true);

  const fetchFoods = async (lang) => {
    const response = await useApiFetch("/v1/food-with-category", lang);
    foods.value = response.data || [];
    isLoading.value = false;
  };

  const addFood = (food) => {
    const existing = selectedFoods.value.find((f) => f.id === food.id);
    if (existing) {
      existing.count++;
    } else {
      selectedFoods.value.push({ ...food, count: 1 });
    }
  };

  const decrementFood = (id) => {
    const index = selectedFoods.value.findIndex((f) => f.id === id);
    if (index !== -1) {
      if (selectedFoods.value[index].count > 1) {
        selectedFoods.value[index].count--;
      } else {
        selectedFoods.value.splice(index, 1);
      }
    }
  };

  const clearCart = () => {
    counter.value = true;
  };
  const resetSelectedCard = () => {
    selectedFoods.value = [];
  };

  const totalPrice = computed(() =>
    selectedFoods.value.reduce((sum, f) => sum + f.price * f.count, 0)
  );

  return {
    foods,
    selectedFoods,
    fetchFoods,
    addFood,
    decrementFood,
    clearCart,
    totalPrice,
    tableId,
    counter,
    isLoading,
    resetSelectedCard,
  };
});
