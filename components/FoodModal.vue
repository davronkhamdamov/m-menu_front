<script setup>
import { ref, watch } from "vue";

const props = defineProps({
  show: Boolean,
  order: Object,
});
const { locale } = useI18n()
const emit = defineEmits(["close", "take"]);
const isTaken = ref(false);

const foods = ref([]);
const loading = ref(true);

async function fetchTableOrders() {
  if (props.order?.id) {
    loading.value = true;
    const { data } = await useFetch(
      `http://localhost:8080/v1/order/${props.order.id}`
    );
    foods.value = data.value?.data || [];
    loading.value = false;
  }
}

watch(
  () => props.show,
  (newVal) => {
    if (newVal && props.order) {
      fetchTableOrders();
      isTaken.value = false;
    }
  }
);

async function takeOrder() {
  isTaken.value = true;
  try {
    useApiFetch(`/v1/order/receive/${props.order.id}`, locale.value, "PUT")
    foods.value.status = 'in_process'
    emit("take", props.order);
  } catch (error) {
    console.error("Buyurtmani yakunlashda xatolik:", error);
  }
}

async function finishOrder() {
  isTaken.value = true;
  try {
    useApiFetch(`/v1/order/${props.order.id}`, locale.value, "PUT")
    emit("close");
  } catch (error) {
    console.error("Buyurtmani yakunlashda xatolik:", error);
  }
}

function formatDateTime(datetime) {
  if (!datetime) return "";
  const date = new Date(datetime);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${year}-${month}-${day} ${hours}:${minutes}`;
}

const isShow = ref(props.show)
</script>

<template>
  <UModal name="modal" v-if="props.show" :defaultOpen="true" :close="{
    color: 'primary', variant: 'outline', class: 'material-symbols:close-small-rounded'
  }" :dismissible="false" @close:prevent="$emit('close')">
    <template #body>
      <h2 class="text-xl font-semibold mb-4">Stol raqami: #{{ order?.table?.number }}</h2>
      <div class="h-80 overflow-auto">
        <div class="mt-3 last:mb-4 first:mt-5 px-1" v-if="!loading" v-for="food in foods.foods">
          <UCard>
            <p class="text-sm">Nomi: {{ food.name }}</p>
            <p class="text-sm">Narxi: {{ formatUZS(food.price) }} so'm</p>
            <p class="text-sm">Soni: {{ food.quantity }} ta</p>
          </UCard>
        </div>
        <p v-if="loading">Yuklanmoqda...</p>
        <p v-if="!loading && !foods.foods[0]">
          Hech qanday malumot topilmadi
        </p>
      </div>
      <p class="modal__text mt-2">
        Buyurtma vaqti {{ formatDateTime(foods.updated) }}
      </p>
      <h2 class="font-medium text-center mt-2">
        Umumiy narxi {{ formatUZS(foods?.total) }} so'm
      </h2>
      <div class="flex justify-end gap-3 mt-4">
        <button v-if="!isTaken && foods.status == 'pending'" @click="takeOrder"
          class="px-4 py-2 rounded transition w-full bg-green-600 text-white hover:bg-green-700">
          Buyurtmani olish
        </button>
        <button v-else-if="foods.status == 'in_process'" @click="finishOrder"
          class="px-4 py-2 rounded transition w-full bg-green-600 text-white hover:bg-green-700">
          Buyurtmani yakunlash
        </button>
        <button v-else-if="foods.status == 'done'" disabled
          class="px-4 py-2 rounded transition w-full bg-green-600 opacity-80 text-whit">
          Buyurtma yakunlangan
        </button>
      </div>
    </template>
  </UModal>
</template>
