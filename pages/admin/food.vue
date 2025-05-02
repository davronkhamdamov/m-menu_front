<template>
    <div v-if="fetchError" class="text-red-500 mb-4">{{ fetchError }}</div>
    <div class="w-full flex justify-between">
        <h3 class="text-2xl font-bold mb-8">{{ $t("foods") }}</h3>
        <div class="ml-3">
            <CreateFood :fetchData="fetchData" />
        </div>
    </div>
    <UTable ref="table" :pagination-options="{ getPaginationRowModel: getPaginationRowModel() }"
        v-model:pagination="pagination" :loading="isLoading" loading-color="primary" :data="data"
        class="w-[90vw] xl:w-[100%] min-h-[300px]" :columns="columns" />
    <div class="flex justify-center border-t border-(--ui-border) pt-4">
        <UPagination :default-page="(table?.tableApi?.getState().pagination.pageIndex || 0) + 1"
            :items-per-page="table?.tableApi?.getState().pagination.pageSize"
            :total="table?.tableApi?.getFilteredRowModel().rows.length"
            @update:page="(p) => table?.tableApi?.setPageIndex(p - 1)" />
    </div>
</template>

<script setup>
import { getPaginationRowModel } from '@tanstack/vue-table'
const { t } = useI18n()
const table = useTemplateRef('table')

import { UBadge } from '#components'
import CreateFood from '~/components/CreateFood.vue'
import DeleteModal from '~/components/DeleteModal.vue'

const data = ref([])
const fetchError = ref(null)
const isLoading = ref(true);
const { locale } = useI18n()

const pagination = ref({
    pageIndex: 0,
    pageSize: 10,
    total: 0
})

const fetchData = async () => {
    try {
        const response = await useApiFetch('/v1/food', locale.value)
        if (response.message != "OK") {
            fetchError.value = 'Failed to fetch table data!';
            console.error('Fetch error:', response.message);
            return;
        }
        data.value = response?.data || [];
        pagination.value.total = response?.data.length
    } catch (err) {
        console.error('Unexpected error:', err);
        fetchError.value = 'Something went wrong while fetching.';
    } finally {
        isLoading.value = false;
    }
};

const columns = [
    {
        accessorKey: 'name',
        header: t("name_of"),
    },
    {
        accessorKey: 'price',
        header: t("price"),
        cell: ({ row }) => {
            return h('p', {}, formatUZS(row.original.price) + t("currency"))
        }
    },
    {
        accessorKey: 'weight',
        header: t("weight"),
        cell: ({ row }) => {
            return h('p', {}, row.original.weight + " " + row.original.weight_type)
        }
    },
    {
        accessorKey: 'available',
        header: t("availability"),
        cell: ({ row }) => {
            const color = row.original.available ? "success" : "error"
            return h(UBadge, { class: 'capitalize', variant: 'subtle', color }, () =>
                row.getValue('available') ? t("available") : t("notAvailable")
            )
        }
    },
    {
        accessorKey: 'id',
        header: "",
        cell: ({ row }) => {
            return h('div', { class: 'text-center flex gap-4 justify-center' },
                h(CreateFood, { id: row.getValue("id"), fetchData }),
                h(DeleteModal, { id: row.getValue("id"), type: "food", fetchData: fetchData })
            )
        }
    }
]

onMounted(async () => {
    fetchData()
});

definePageMeta({
    layout: 'admin'
})


</script>