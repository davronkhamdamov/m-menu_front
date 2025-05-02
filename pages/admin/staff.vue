<template>
    <div v-if="fetchError" class="text-red-500 mb-4">{{ fetchError }}</div>
    <div class="w-full flex justify-between">
        <h3 class="text-2xl font-bold mb-8">{{ $t("staff") }}</h3>
        <div class="ml-3">
            <CreateStaff :fetchData="fetchData" />
        </div>
    </div>
    <UTable ref="table" :pagination-options="{ getPaginationRowModel: getPaginationRowModel() }"
        v-model:pagination="pagination" :loading="isLoading" loading-color="primary" loading-animation="carousel"
        :data="tables" class="flex-1" :columns="columns" />
    <div class="flex justify-center border-t border-(--ui-border) pt-4">
        <UPagination :default-page="(table?.tableApi?.getState().pagination.pageIndex || 0) + 1"
            :items-per-page="table?.tableApi?.getState().pagination.pageSize"
            :total="table?.tableApi?.getFilteredRowModel().rows.length"
            @update:page="(p) => table?.tableApi?.setPageIndex(p - 1)" />
    </div>
</template>

<script setup>

import CreateStaff from '~/components/CreateStaff.vue'
import DeleteModal from '~/components/DeleteModal.vue'
import { getPaginationRowModel } from '@tanstack/vue-table'

const { t, locale } = useI18n()
const tables = ref([])
const fetchError = ref(null)
const isLoading = ref(true);
const table = useTemplateRef('table')

const pagination = ref({
    pageIndex: 0,
    pageSize: 10,
    total: 0
})

const fetchData = async () => {
    try {
        const response = await useApiFetch('/v1/staff', locale.value)

        if (response.message >= 400) {
            fetchError.value = 'Failed to fetch table data!';
            console.error('Fetch error:', response.message);
            return;
        }

        tables.value = response?.data || [];
        pagination.value.total = response?.data
    } catch (err) {
        console.error('Unexpected error:', err);
        fetchError.value = 'Something went wrong while fetching.';
    } finally {
        isLoading.value = false;
    }
};
const columns = [
    {
        accessorKey: 'login',
        header: t('login'),
    },
    {
        accessorKey: 'id',
        header: "",
        cell: ({ row }) => {
            return h('div', { class: 'text-center flex gap-4 justify-center' },
                h(CreateStaff, { id: row.getValue("id"), fetchData }),
                h(DeleteModal, { id: row.getValue("id"), type: "staff", fetchData: fetchData })
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
