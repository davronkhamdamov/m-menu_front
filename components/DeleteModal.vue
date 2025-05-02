<script setup>
const open = ref(false)
const loading = ref(false)
const props = defineProps({
    id: String,
    type: String,
    fetchData: {
        type: Function,
        required: false
    }
});
const toast = useToast()
async function Delete() {
    loading.value = true
    try {
        const response = await useApiFetch(`/v1/${props.type}/${props.id}`, '', "DELETE")
        if (response.status > 200) {
            toast.add({ title: 'Xatolik', description: "Nimadir xato ketdi", color: 'error' })
            return
        }
        toast.add({ title: 'Mufavaqqiyatli', description: 'Mufavaqqiyatli o\'chirildi', color: 'success' })
    } catch (err) {
        console.log(err);
    } finally {
        open.value = false
        loading.value = false
        props.fetchData()
    }
}
</script>

<template>
    <UModal v-model:open="open" :title="$t('confirm_delete_table')" :ui="{ footer: 'justify-end' }">
        <UButton icon="ic:sharp-delete" color="error" variant="ghost" />
        <template #footer>
            <div class="flex justify-end gap-5">
                <UButton :label="$t('cancel')" color="neutral" variant="outline" @click="open = false" />
                <UButton :label="$t('delete')" color="error" type="submit" @click="Delete" :loading="loading" />
            </div>
        </template>
    </UModal>

</template>
