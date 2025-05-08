<script setup>
import FoodModal from "~/components/FoodModal.vue";
import { ref } from "vue";
import dayjs from "dayjs";
const isModalOpen = ref(false);
const selectedOrder = ref({});
const token = window?.localStorage?.getItem("token")
const orders = ref([]);

onMounted(async () => {
  const data = await useApiFetch("/v1/order_staff");
  orders.value = data?.data
})
function openModal(order) {
  selectedOrder.value = order;
  isModalOpen.value = true;
}
const config = useRuntimeConfig();
const baseURL = config.public.apiWsBaseUrl;

function handleTakeOrder(order) {
  console.log("Zakaz olindi:", order.id);
}
const socket = new WebSocket(`${baseURL}/ws?token=${token}`);
import sound from '../assets/sound/mixkit-software-interface-start-2574.wav'

socket.onmessage = (event) => {
  const message = JSON.parse(event.data);
  if (message.event === "new_order") {
    playSound()
    orders.value.push(message.data)
  }
  if (message.event === "status_updated") {
    if (message.data.status == "in_process") {
      orders.value = orders.value.map(e => {
        if (e.id == message.data.id) {
          return { ...e, status: message.data.status }
        }
        return e
      })
    } else if (message.data.status == "done") {
      orders.value = orders.value.filter(e => e.id != message.data.id)
    }
  }
}
function playSound() {
  const audio = new Audio();
  audio.src = sound;
  audio.play()
    .then(() => console.log('Audio played'))
    .catch((err) => console.error('Error playing audio:', err));
}

</script>

<template>
  <div v-if="orders.length === 0">
    <p>Hozircha buyurtmalar yo'q.</p>
  </div>
  <div class="grid grid-cols-2 gap-4 lg:grid-cols-4 mt-4">
    <UCard v-for="order in orders" :key="order.id" class="rounded-2xl border">
      <div class="flex flex-col gap-5">
        <div class="flex justify-between">
          <p class="text-lg font-bold">Stol: #{{ order.table.number }}</p>
          <UBadge color="error" label="Yangi" v-if="order.status == 'pending'" />
          <UBadge color="primary" label="Jarayonda" v-else-if="order.status == 'in_process'" />
        </div>
        <p class="text-lg font-bold">#{{ order.order_id }}</p>

        <p>{{ dayjs(order.created).format("HH:mm DD-MM-YYYY") }}</p>
        <button class="border border-solid p-2 rounded-lg w-full cursor-pointer" @click="openModal(order)">
          Buyurtmani ko'rish
        </button>
      </div>
    </UCard>
  </div>
  <FoodModal :show="isModalOpen" :order="selectedOrder" @close="isModalOpen = false" @take="handleTakeOrder" />
</template>
