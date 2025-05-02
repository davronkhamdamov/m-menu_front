<script setup >
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
    number: v.pipe(v.number(), v.gtValue(0)),
})


const state = reactive({
    number: 0
})
watch(open, (async () => {
    if (props.id) {
        const response = await useApiFetch(`/v1/table/one/${props.id}`, '', "GET")
        if (response.status > 200) {
            toast.add({ title: 'Xatolik', description: "Nimadir xatolik ketdi!", color: 'error' })
            return
        }
        state.number = response.data.number
    }
}))
const toast = useToast()
async function onSubmit(event) {
    loading.value = true
    try {
        if (props.id) {
            const response = await useApiFetch(`/v1/table/${props.id}`, '', "PUT", event.data)
            if (response.status >= 400) {
                toast.add({ title: 'Xatolik', description: "Stolni yangilashda nimadir xatolik ketdi!", color: 'error' })
                return
            }
            toast.add({ title: 'Mufavaqqiyatli', description: 'Stol mufavaqqiyatli yangilandi', color: 'success' })
        } else {
            const response = await useApiFetch("/v1/table", '', "POST", event.data)
            if (response.message == "Table already exists") {
                toast.add({ title: 'Xatolik', description: "Stol allaqochon yaratilgan", color: 'error' })
                return
            }
            toast.add({ title: 'Mufavaqqiyatli', description: 'Stol mufavaqqiyatli yaratildi', color: 'success' })
        }
    } catch (err) {
        console.log(err);
    } finally {
        open.value = false
        loading.value = false
        props.fetchData && props.fetchData()
    }
}
</script>

<template>
    <UModal v-model:open="open" :title="props.id ? $t('updateTable') : $t('addNewTable')"
        :ui="{ footer: 'justify-end' }">
        <UButton v-if="props.id" variant="ghost" icon="hugeicons:edit-02"></UButton>
        <UButton v-else icon="material-symbols:add-2" :label="$t('addNewTable')" color="primary" variant="subtle" />
        <template #body>
            <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
                <div class="flex justify-center h-18">
                    <UFormField :label="$t('table_number')" name="number">
                        <UInputNumber v-model="state.number" :min="1" :max="50" />
                    </UFormField>
                </div>
                <div class="flex justify-end gap-5">
                    <UButton :label="$t('cancel')" color="neutral" variant="outline" @click="open = false" />
                    <UButton v-if="props.id" :label="$t('update')" color="neutral" type="submit" :loading="loading" />
                    <UButton v-else :label="$t('create')" color="neutral" type="submit" :loading="loading" />
                </div>
            </UForm>
        </template>
    </UModal>

</template>
