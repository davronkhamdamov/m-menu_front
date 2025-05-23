<template>
    <div v-if="fetchError" class="text-red-500 mb-4">{{ fetchError }}</div>
    <div class="w-full flex justify-between">
        <h3 class="text-2xl font-bold mb-8">{{ $t("feedback") }}</h3>
    </div>
    <UTable ref="table" :pagination-options="{ getPaginationRowModel: getPaginationRowModel() }"
        v-model:pagination="pagination" v-model:column-pinning="columnPinning" :loading="isLoading"
        loading-color="primary" loading-animation="carousel" :data="tables"
        class="flex-1 w-[90vw] xl:w-[100%] min-h-[300px]" :columns="columns" />
    <div class="flex justify-center border-t border-(--ui-border) pt-4">
        <UPagination :default-page="(table?.tableApi?.getState().pagination.pageIndex || 0) + 1"
            :items-per-page="table?.tableApi?.getState().pagination.pageSize"
            :total="table?.tableApi?.getFilteredRowModel().rows.length"
            @update:page="(p) => table?.tableApi?.setPageIndex(p - 1)" />
    </div>
    <div class="flex w-full justify-end" @click="dowloadXlsx">
        <UButton>
            {{ $t("download_as_excel") }}
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
                <g fill="currentColor" fill-rule="evenodd" clip-rule="evenodd">
                    <path
                        d="M3 14.25a.75.75 0 0 1 .75.75c0 1.435.002 2.436.103 3.192c.099.734.28 1.122.556 1.399c.277.277.665.457 1.4.556c.754.101 1.756.103 3.191.103h6c1.435 0 2.436-.002 3.192-.103c.734-.099 1.122-.28 1.399-.556c.277-.277.457-.665.556-1.4c.101-.755.103-1.756.103-3.191a.75.75 0 0 1 1.5 0v.055c0 1.367 0 2.47-.116 3.337c-.122.9-.38 1.658-.982 2.26s-1.36.86-2.26.982c-.867.116-1.97.116-3.337.116h-6.11c-1.367 0-2.47 0-3.337-.116c-.9-.122-1.658-.38-2.26-.982s-.86-1.36-.981-2.26c-.117-.867-.117-1.97-.117-3.337V15a.75.75 0 0 1 .75-.75"
                        opacity=".5" />
                    <path
                        d="M12 16.75a.75.75 0 0 0 .553-.244l4-4.375a.75.75 0 1 0-1.107-1.012l-2.696 2.95V3a.75.75 0 0 0-1.5 0v11.068l-2.696-2.95a.75.75 0 0 0-1.108 1.013l4 4.375a.75.75 0 0 0 .554.244" />
                </g>
            </svg>
        </UButton>
    </div>

</template>

<script setup>

import dayjs from 'dayjs';
import { getPaginationRowModel } from '@tanstack/vue-table'

const tables = ref([])
const fetchError = ref(null)
const isLoading = ref(true);
const { t, locale } = useI18n()

const columnPinning = ref({
    left: [],
    right: ['id']
})
const table = useTemplateRef('table')

const pagination = ref({
    pageIndex: 0,
    pageSize: 10,
    total: 0
})
const fetchData = async () => {
    try {
        const response = await useApiFetch('/v1/feedback', locale.value)

        if (response.message != "OK") {
            fetchError.value = 'Failed to fetch table data!';
            console.error('Fetch error:', response.message);
            return;
        }

        tables.value = response?.data || [];
    } catch (err) {
        console.error('Unexpected error:', err);
        fetchError.value = 'Something went wrong while fetching.';
    } finally {
        isLoading.value = false;
    }
};
const columns = [
    {
        accessorKey: 'feedback',
        header: t("feedback"),
    },
    {
        accessorKey: 'star',
        header: t("star"),
    },
    {
        accessorKey: 'table.number',
        header: t("table_number"),
        cell: ({ row }) => `#${row.original.table.number}`
    },
    {
        accessorKey: 'region',
        header: t("region"),
    },
    {
        accessorKey: 'created_at',
        header: t("created_at"),
        cell: ({ row }) => dayjs(row.original.created).format("YYYY-MM-DD hh:mm")
    }
]
const config = useRuntimeConfig();
const baseURL = config.public.apiBaseUrl;

function dowloadXlsx() {
    const fileUrl = baseURL + '/v1/feedback/xlsx';
    const fileName = 'feedback.pdf';
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = fileName;
    link.click();
}
onMounted(async () => {
    fetchData()
});

definePageMeta({
    layout: 'admin'
})


</script>
