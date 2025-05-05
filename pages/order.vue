<script setup>
import SelectedFood from "~/components/SelectedFood.vue";
import { useFoodStore } from "~/stores/food";
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const { locale, t } = useI18n();

const goBack = () => {
  router.back();
};

const {
  data: countries,
  status,
  execute,
} = await useLazyFetch("/api/countries.json", {
  immediate: false,
});

function onOpen() {
  if (!countries.value?.length) {
    execute();
  }
}
const statusMap = {
  pending: 0,
  in_process: 1,
  done: 2,
};

const store = useFoodStore();
const isLoading = ref(false);
const isSending = ref(false);
const success = ref(false);
const endStatus = ref(false);
const modalSuccess = ref(false);
const error = ref(null);
const order_status = ref(0);
const star = ref(0);
const feedback = ref("");
const region = ref("");
const openFeedbackModal = ref(false);

const sendOrder = async () => {
  isLoading.value = true;
  success.value = false;
  error.value = null;
  const payload = {
    table_id: store.tableId,
    foods: store.selectedFoods.map((item) => ({
      food_id: item.id,
      quantity: item.count,
    })),
  };

  const response = await useApiFetch(
    "/v1/order",
    locale.value,
    "POST",
    payload
  );

  if (response.error) {
    console.error(fetchError.value);
    error.value = "Buyurtma yuborishda xatolik yuz berdi.";
  }

  success.value = true;
  modalSuccess.value = true;
  store.clearCart();
  isLoading.value = false;
  const config = useRuntimeConfig();
  const baseURL = config.public.apiWsBaseUrl;

  const socket = new WebSocket(`${baseURL}/ws?table_id=` + store.tableId);
  socket.onmessage = (event) => {
    const message = JSON.parse(event.data);
    if (message.event === "status_updated") {
      order_status.value = statusMap[message.data.status];
    }
  };
};
const sendFeedback = async () => {
  isSending.value = true;
  const response = await useApiFetch("/v1/feedback", locale.value, "POST", {
    table_id: store.tableId,
    star: star.value,
    region: region.value.name,
    feedback: feedback.value,
  });
  if (response.status == 201) {
    isSending.value = false;
    openFeedbackModal.value = false;
    endStatus.value = true;
  }
};
const items = [
  {
    title: t("orderAccepted"),
    icon: "material-symbols:arrow-downward-rounded",
  },
  {
    title: t("preparing"),
    icon: "streamline:travel-hotel-serving-dome-cook-tool-dome-kitchen-drink-serving-platter-dish-tools-food-cooking",
  },
  {
    title: t("orderReady"),
    icon: "lets-icons:done",
  },
];
</script>

<template>
  <UContainer>
    <div class="p-3 shadow-2xl">
      <UIcon name="bitcoin-icons:arrow-left-outline" @click="goBack" />
    </div>
    <SelectedFood />
    <div class="my-10 text-sm">
      {{ t("total") }}: <strong>{{ formatUZS(store.totalPrice) }} so'm</strong>
    </div>
    <UButton color="secondary" v-if="!success" @click="sendOrder" :disabled="isLoading"
      class="w-full rounded-xl h-10 mt-10 text-white cursor-pointer flex justify-center">
      {{ isLoading ? t("sending") : t("ordering") }}
    </UButton>
    <UStepper :items="items" v-else class="w-full" v-model="order_status" disabled color="secondary" />
    <UModal v-model:open="modalSuccess">
      <template #content>
        <div class="h-52 flex items-center justify-center flex-col gap-3">
          <svg xmlns="http://www.w3.org/2000/svg" width="70px" height="70px" viewBox="0 0 24 24">
            <path fill="green" fill-rule="evenodd"
              d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10s-4.477 10-10 10m0-1.2a8.8 8.8 0 1 0 0-17.6a8.8 8.8 0 0 0 0 17.6m-1.172-6.242l5.809-5.808l.848.849l-5.95 5.95a1 1 0 0 1-1.414 0L7 12.426l.849-.849l2.98 2.98z" />
          </svg>
          <p>{{ t("accepted") }} ✅</p>
        </div>
      </template>
    </UModal>
    <div class="flex justify-center mt-10">
      <UModal v-model:open="openFeedbackModal">
        <UButton class="w-max text-white" color="secondary" v-if="success">{{ t("RateService") }}!
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
            <path fill="currentColor"
              d="m8.85 16.825l3.15-1.9l3.15 1.925l-.825-3.6l2.775-2.4l-3.65-.325l-1.45-3.4l-1.45 3.375l-3.65.325l2.775 2.425zm-1.525 2.098l1.24-5.313l-4.123-3.572l5.431-.47L12 4.557l2.127 5.01l5.43.47l-4.123 3.572l1.241 5.313L12 16.102zM12 12.25" />
          </svg>
        </UButton>
        <template #header>
          <p class="font-bold">{{ t("rateTitle") }}</p>
        </template>
        <template #body>
          <p class="text-center text-xl font-bold">
            {{ t("rateInstruction") }}
          </p>
          <br />
          <div class="flex justify-evenly w-[70%] mx-auto mb-5">
            <button class="duration-500" v-for="(_, i) in new Array(5).fill('*')" :key="i" @click="star = i + 1">
              <svg class="duration-500" v-if="star <= i" xmlns="http://www.w3.org/2000/svg" width="45" height="45"
                viewBox="0 0 24 24">
                <path fill="currentColor"
                  d="m8.85 16.825l3.15-1.9l3.15 1.925l-.825-3.6l2.775-2.4l-3.65-.325l-1.45-3.4l-1.45 3.375l-3.65.325l2.775 2.425zm-1.525 2.098l1.24-5.313l-4.123-3.572l5.431-.47L12 4.557l2.127 5.01l5.43.47l-4.123 3.572l1.241 5.313L12 16.102zM12 12.25" />
              </svg>
              <svg v-else class="animate-wiggle origin-top duration-500" xmlns="http://www.w3.org/2000/svg" width="45"
                height="45" viewBox="0 0 24 24">
                <path fill="yellow"
                  d="m7.325 18.923l1.24-5.313l-4.123-3.572l5.431-.47L12 4.557l2.127 5.01l5.43.47l-4.123 3.572l1.241 5.313L12 16.102z" />
              </svg>
            </button>
          </div>
          <p>{{ t("leaveFeedback") }}</p>
          <UTextarea v-model="feedback" autoresize class="w-full mx-1" :placeholder="t('leaveFeedback')" />
          <p class="mt-4">{{ t("selectCountry") }}</p>
          <USelectMenu :items="countries" :loading="status === 'pending'" label-key="name" v-model="region"
            :search-input="{ icon: 'i-lucide-search' }" :placeholder="t('selectPlaceholder')" class="w-full mt-1"
            @update:open="onOpen">
            <template #leading="{ modelValue, ui }">
              <span v-if="modelValue" class="size-5 text-center">
                {{ modelValue?.emoji }}
              </span>
              <UIcon v-else name="i-lucide-earth" :class="ui.leadingIcon()" />
            </template>
            <template #item-leading="{ item }">
              <span class="size-5 text-center">
                {{ item.emoji }}
              </span>
            </template>
          </USelectMenu>
        </template>
        <template #footer>
          <div class="flex justify-end w-full gap-5">
            <UButton :label="t('later')" color="neutral" variant="outline" @click="openFeedbackModal = false" />
            <UButton :label="t('send')" color="secondary" @click="sendFeedback" :loading="isSending" />
          </div>
        </template>
      </UModal>
    </div>
    <UModal v-model:open="endStatus">
      <template #content>
        <div class="h-52 flex items-center justify-center flex-col gap-3">
          <svg xmlns="http://www.w3.org/2000/svg" width="70px" height="70px" viewBox="0 0 24 24">
            <path fill="green" fill-rule="evenodd"
              d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10s-4.477 10-10 10m0-1.2a8.8 8.8 0 1 0 0-17.6a8.8 8.8 0 0 0 0 17.6m-1.172-6.242l5.809-5.808l.848.849l-5.95 5.95a1 1 0 0 1-1.414 0L7 12.426l.849-.849l2.98 2.98z" />
          </svg>
          <p>Bizning xizmatlarimizdan foydalanangiz uchun rahmat 😊</p>
        </div>
      </template>
    </UModal>

    <p v-if="error" class="text-red-600 mt-4">{{ error }}</p>
  </UContainer>
</template>
