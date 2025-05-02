<template>
    <div v-if="fetchError" class="text-red-500 mb-4">{{ fetchError }}</div>
    <div class="w-full flex justify-between">
        <h3 class="text-2xl font-bold mb-8">{{ $t("orders") }}</h3>
    </div>
    <UTable ref="table" :pagination-options="{ getPaginationRowModel: getPaginationRowModel() }"
        v-model:pagination="pagination" v-model:column-pinning="columnPinning" :loading="isLoading"
        loading-color="primary" loading-animation="carousel" :data="tables" class="flex-1" :columns="columns" />
    <div class="flex justify-center border-t border-(--ui-border) pt-4">
        <UPagination :default-page="(table?.tableApi?.getState().pagination.pageIndex || 0) + 1"
            :items-per-page="table?.tableApi?.getState().pagination.pageSize"
            :total="table?.tableApi?.getFilteredRowModel().rows.length"
            @update:page="(p) => table?.tableApi?.setPageIndex(p - 1)" />
    </div>
    <div class="flex w-full justify-end mt-10" @click="dowloadXlsx">
        <UButton>
            Excel fileda yuklash
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
import { getPaginationRowModel } from '@tanstack/vue-table'
import dayjs from 'dayjs';
import formatUZS from '../../composables/formatUZS';
import { UBadge } from '#components';
const tables = ref([])
const fetchError = ref(null)
const isLoading = ref(true);
const { t, locale } = useI18n()
const table = useTemplateRef('table')

const pagination = ref({
    pageIndex: 0,
    pageSize: 10,
    total: 0
})

const columnPinning = ref({
    left: [],
    right: ['id']
})

const fetchData = async () => {
    try {
        const response = await useApiFetch('/v1/order', locale.value)
        if (response.status != 200) {
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
const statusObject = {
    pending: {
        label: "Kutilmoqda",
        variant: "subtle",
        color: "info"
    },
    in_process: {
        label: "Jarayonda",
        variant: "subtle",
        color: "warning"
    },
    done: {
        label: "Yakunlangan",
        variant: "subtle",
        color: "success"
    }
}

const columns = [
    {
        accessorKey: 'order_id',
        header: t("order_id", "Buyurtma raqami"),
        cell: ({ row }) => `#${row.original.order_id}`
    },
    {
        accessorKey: 'table.number',
        header: t("table_number"),
        cell: ({ row }) => `#${row.original.table.number}`
    },
    {
        accessorKey: 'created',
        header: t("ordered_date"),
        cell: ({ row }) => dayjs(row.original.created).format("YYYY-MM-DD hh:mm")
    },
    {
        accessorKey: 'status',
        header: t("status"),
        cell: ({ row }) => h(UBadge, statusObject[row.getValue("status")])
    },
    {
        accessorKey: 'total',
        header: t("total"),
        cell: ({ row }) => formatUZS(row.original.total) + t("currency")
    }
]
function dowloadXlsx() {
    const fileUrl = 'http://localhost:8080/v1/order/xlsx';
    const fileName = 'orders.pdf';
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
