<script setup>
import * as v from 'valibot'
const { t } = useI18n()
const open = ref(false)
const category = ref([])
const isLoading = ref(false)

const props = defineProps({
    id: {
        type: String,
        required: false
    },
    fetchData: {
        type: Function,
        required: false
    }
});

const schema = v.object({
    name_uz: v.pipe(v.string(t('please_enter_food_name')), v.minLength(3, t('food_name_validation'))),
    name_ru: v.pipe(v.string(t('please_enter_food_name')), v.minLength(3, t('food_name_validation'))),
    name_en: v.pipe(v.string(t('please_enter_food_name')), v.minLength(3, t('food_name_validation'))),
    description_uz: v.pipe(v.string(t('please_enter_food_description')), v.minLength(3, t('food_description_validation'))),
    description_ru: v.pipe(v.string(t('please_enter_food_description')), v.minLength(3, t('food_description_validation'))),
    description_en: v.pipe(v.string(t('please_enter_food_description')), v.minLength(3, t('food_description_validation'))),
    price: v.pipe(v.number(t('please_enter_food_price')), v.gtValue(999, t('food_price_validation'))),
    weight: v.pipe(v.number(t('please_enter_food_weight')), v.gtValue(0.1, t('food_weight_validation'))),
    category_id: v.pipe(v.string(t('please_select_food_category'))),
    image_url: v.pipe(v.string(t('please_enter_image_url'))),
    image: v.pipe(v.string())
})

const { locale } = useI18n()
const state = reactive({
    name_uz: '',
    name_ru: '',
    name_en: '',
    price: 0,
    weight: 0,
    weight_type: "G",
    image_url: '',
    category_id: '',
    description_uz: "",
    description_ru: "",
    description_en: "",
    image: ""
})
const fetchData = async () => {
    try {
        const response = await useApiFetch('/v1/category', locale.value)
        if (response.message != "OK") {
            console.error('Fetch error:', response.message);
            return;
        }
        category.value = response?.data?.map((e) => {
            return {
                label: e.name,
                value: e.id
            }
        });
    } catch (err) {
        console.error('Unexpected error:', err);
    }
};
const uploadImage = async (formData) => {
    return await fetch("https://api.cloudinary.com/v1_1/didddubfm/image/upload", {
        method: "POST",
        body: formData,
    })
        .then((res) => res.json())
        .then(async (data) => data.url)
}
const toast = useToast()
async function onSubmit(e) {
    isLoading.value = true
    const formData = new FormData();
    formData.append("file", e.target.image.files[0]);
    formData.append("upload_preset", "youtube");
    let image_url
    if (e.target.image.files[0]) {
        image_url = await uploadImage(formData);
    }
    try {
        if (props.id) {
            const response = await useApiFetch(`/v1/food/${props.id}`, '', "PUT", { ...e.data, image_url: image_url || state.image_url })
            if (response.status >= 400) {
                toast.add({ title: 'Xatolik', description: response.message, color: 'error' })
                return
            }
            open.value = false
            toast.add({ title: 'Mufavaqqiyatli', description: 'Ovqat mufavaqqiyatli yangilandi', color: 'success' })
        } else {
            const response = await useApiFetch("/v1/food", '', "POST", { ...e.data, image_url })
            if (response.status >= 400) {
                toast.add({ title: 'Xatolik', description: response.message, color: 'error' })
                return
            }
            open.value = false
            toast.add({ title: 'Mufavaqqiyatli', description: 'Ovqat mufavaqqiyatli yaratildi', color: 'success' })
        }
    } catch (err) {
        console.log(err);
    } finally {
        props.fetchData()
        isLoading.value = false;
        state.name_uz = ''
        state.name_ru = ''
        state.name_en = ''
        state.price = 0
        state.weight = 0
        state.weight_type = "G"
        state.image_url = ''
        state.category_id = ''
        state.description_uz = ""
        state.description_ru = ""
        state.description_en = ""
        state.image = ""
    }
}
const items = ref([
    {
        label: 'Kilogram',
        value: 'kg'
    },
    {
        label: 'Litr',
        value: 'l'
    },
    {
        label: 'Gram',
        value: 'g'
    },
])
watch(open, (async () => {
    state.image = ''
    fetchData()
    if (props.id) {
        const response = await useApiFetch(`/v1/food/${props.id}`, '', "GET")
        if (response.status >= 400) {
            toast.add({ title: 'Xatolik', description: "Nimadir xatolik ketdi!", color: 'error' })
            return
        }
        state.name_uz = response.data.name_uz
        state.name_ru = response.data.name_ru
        state.name_en = response.data.name_en
        state.price = response.data.price
        state.weight = response.data.weight
        state.weight_type = response.data.weight_type
        state.image_url = response.data.image_url
        state.category_id = response.data.category_id
        state.description_uz = response.data.description_uz
        state.description_ru = response.data.description_ru
        state.description_en = response.data.description_en
    }
}))
</script>

<template>
    <UModal v-model:open="open" :title="props.id ? $t('update_food') : $t('add_food')" :ui="{ footer: 'justify-end' }">
        <UButton v-if="props.id" variant="ghost" icon="hugeicons:edit-02"></UButton>
        <UButton v-else icon="material-symbols:add-2" :label="$t('addNewFood')" color="primary" variant="subtle" />
        <template #body>
            <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
                <div class="flex justify-center flex-col w-full gap-4">
                    <UFormField :label="$t('food_name') + ' Oʻzbek'" name="name_uz">
                        <UInput v-model="state.name_uz" class="w-full"
                            :placeholder="$t('enter_food_name') + ' oʻzbek'" />
                    </UFormField>
                    <UFormField :label="$t('food_name') + ' Русский'" name="name_ru">
                        <UInput v-model="state.name_ru" class="w-full"
                            :placeholder="$t('enter_food_name') + ' русский'" />
                    </UFormField>
                    <UFormField :label="$t('food_name') + ' English'" name="name_en">
                        <UInput v-model="state.name_en" class="w-full"
                            :placeholder="$t('enter_food_name') + ' english'" />
                    </UFormField>
                    <UFormField :label="$t('food_description','Food description') + ' Oʻzbek'" name="description_uz">
                        <UTextarea v-model="state.description_uz" class="w-full" />
                    </UFormField>
                    <UFormField :label="$t('food_description','Food description') + ' Русский'" name="description_ru">
                        <UTextarea v-model="state.description_ru" class="w-full" />
                    </UFormField>
                    <UFormField :label="$t('food_description','Food description') + ' English'" name="description_en">
                        <UTextarea v-model="state.description_en" class="w-full" />
                    </UFormField>
                    <UFormField :label="$t('food_price')" name="price">
                        <UInputNumber v-model="state.price" class="w-full" :placeholder="$t('enter_food_price')"
                            :step="1000" :format-options="{
                                style: 'currency',
                                currency: 'UZS',
                                currencyDisplay: 'code',
                                currencySign: 'accounting',
                                minimumFractionDigits: 0,
                                maximumFractionDigits: 0
                            }" />
                    </UFormField>
                    <UFormField :label="$t('food_weight')" name="weight">
                        <UInputNumber v-model="state.weight" class="w-full" :placeholder="$t('enter_food_weight')" />
                    </UFormField>
                    <UFormField :label="$t('food_weight_type')" name="weight_type">
                        <USelect v-model="state.weight_type" :items="items" class="w-full"
                            :placeholder="$t('select_food_weight_type')" />
                    </UFormField>
                    <UFormField :label="$t('select_category')" name="category_id">
                        <USelect v-model="state.category_id" :items="category" class="w-full"
                            :placeholder="$t('select_food_category')" />
                    </UFormField>
                    <div class="flex items-center flex-col gap-5">
                        <UFormField class="w-full" :label="$t('choose_image')" name="image">
                            <UInput type="file" v-model="state.image" class="w-full" accept="image/png, image/jpeg" />
                        </UFormField>
                        <img v-if="state.image_url" :src="state.image_url" alt="image"
                            class="w-full rounded-3xl min-h-14">
                    </div>
                </div>
                <div class="flex justify-end gap-5">
                    <UButton :label="$t('cancel')" color="neutral" variant="outline" @click="open = false" />
                    <UButton :label="props.id ?$t('update') : $t('create')" color="neutral" type="submit" :loading="isLoading" />
                </div>
            </UForm>
        </template>
    </UModal>
</template>
