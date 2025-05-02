<script setup>
import * as v from 'valibot'
const open = ref(false)
const loading = ref(false)
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
    name_en: v.pipe(v.string(), v.minLength(3, "Toifa nomi 3 tadan ko'p bo'lishi kerak")),
    name_uz: v.pipe(v.string(), v.minLength(3, "Toifa nomi 3 tadan ko'p bo'lishi kerak")),
    name_ru: v.pipe(v.string(), v.minLength(3, "Toifa nomi 3 tadan ko'p bo'lishi kerak")),
})

const state = reactive({
    name_uz: '',
    name_ru: '',
    name_en: ''
})

const toast = useToast()
async function onSubmit(event) {
    try {
        if (props.id) {
            const response = await useApiFetch(`/v1/category/${props.id}`, null, "PUT", event.data)
            if (response.status >= 400) {
                toast.add({ title: 'Xatolik', description: response.message, color: 'error' })
                return
            }
            toast.add({ title: 'Mufavaqqiyatli', description: 'Toifa mufavaqqiyatli yangilandi', color: 'success' })
        } else {
            const response = await useApiFetch("/v1/category", null, "POST", event.data)
            if (response.status >= 400) {
                toast.add({ title: 'Xatolik', description: response.message, color: 'error' })
                return
            }
            toast.add({ title: 'Mufavaqqiyatli', description: 'Toifa mufavaqqiyatli yaratildi', color: 'success' })
        }
    } catch (err) {
        console.log(err);
    } finally {
        props.fetchData()
        open.value = false
        loading.value = false
    }
}
watch(open, (async () => {
    if (props.id) {
        const response = await useApiFetch(`/v1/category/${props.id}`, '', "GET")
        if (response.status >= 400) {
            toast.add({ title: 'Xatolik', description: "Nimadir xatolik ketdi!", color: 'error' })
            return
        }
        state.name_en = response.data.name_en
        state.name_ru = response.data.name_ru
        state.name_uz = response.data.name_uz
    }
}))

</script>

<template>
    <UModal v-model:open="open" :title="props.id ? $t('updateCategory') : $t('addNewCategory')"
        :ui="{ footer: 'justify-end' }">
        <UButton v-if="props.id" variant="ghost" icon="hugeicons:edit-02"></UButton>
        <UButton v-else icon="material-symbols:add-2" :label="$t('addNewCategory')" color="primary" variant="subtle" />
        <template #body>
            <UForm :schema="schema" :state="state" @submit="onSubmit">
                <div class="flex gap-5 h-auto flex-col">
                    <UFormField label="Toifa nomi o'zbek" name="name_uz" class="w-full">
                        <UInput v-model="state.name_uz" :min="1" :max="50" class="w-full" />
                    </UFormField>
                    <UFormField label="Toifa nomi ruscha" name="name_ru" class="w-full">
                        <UInput v-model="state.name_ru" :min="1" :max="50" class="w-full" />
                    </UFormField>
                    <UFormField label="Toifa nomi inglizcha" name="name_en" class="w-full">
                        <UInput v-model="state.name_en" :min="1" :max="50" class="w-full" />
                    </UFormField>
                </div>
                <div class="flex justify-end gap-5 mt-5">
                    <UButton :label="$t('cancel')" color="neutral" variant="outline" @click="open = false" />
                    <UButton v-if="props.id" :label="$t('update')" color="neutral" type="submit" :loading="loading" />
                    <UButton v-else :label="$t('create')" color="neutral" type="submit" :loading="loading" />
                </div>
            </UForm>
        </template>
    </UModal>
</template>
