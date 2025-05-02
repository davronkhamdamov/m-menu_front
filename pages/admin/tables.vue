<template>
    <div v-if="fetchError" class="text-red-500 mb-4">{{ fetchError }}</div>
    <div class="w-full flex justify-between">
        <h3 class="text-2xl font-bold mb-8">{{ $t("tables") }}</h3>
        <div>
            <CreateTable :fetchData="fetchData" />
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
import { UButton } from '#components';
import CreateTable from '~/components/CreateTable.vue'
import { getPaginationRowModel } from '@tanstack/vue-table'
import DeleteModal from '~/components/DeleteModal.vue'
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

const config = useRuntimeConfig();
const baseURL = config.public.apiBaseUrl;
const printQRCode = (imgUrl) => {
    const screenWidth = window.screen.availWidth
    const screenHeight = window.screen.availHeight


    const width = Math.floor(screenWidth * 0.7)
    const height = Math.floor(screenHeight * 0.7)

    const left = Math.floor((screenWidth - width) / 2)
    const top = Math.floor((screenHeight - height) / 2)

    const features = `width=${width},height=${height},top=${top},left=${left},resizable=yes,scrollbars=yes`
    const win = window.open('', `PrintWindow-${Date.now()}`, features)
    win.document.write(`<html>
      <head>
        <title>Qr Code</title>
      </head>
      <style>
        @media print {
            @page {
                    margin: 0;
            }
            body {
                margin: 0;
            }
        }
      </style>
      <body style="display: flex; justify-content: center; align-items: center; margin: 0;">
            <img src="${imgUrl}" style="width: 500px; width: 500px;" />
            <script>
            window.onload = function() {
                window.print();
                setTimeout(() => window.close(), 1000)
            }
            <\/script>
        </body>
    </html>`)
    win.document.close()
}

const fetchData = async () => {
    try {
        const response = await useApiFetch('/v1/table', locale.value)

        if (response.message != "OK") {
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
        accessorKey: 'number',
        header: t('number'),
        cell: ({ row }) => `#${row.getValue('number')}`
    },
    {
        accessorKey: 'id',
        header: "",
        cell: ({ row }) => {
            return h('div', { class: 'text-center flex gap-4 justify-end' },
                h(CreateTable, { id: row.getValue("id"), fetchData }),
                h(UButton, {
                    variant: "ghost",
                    onClick: () => printQRCode(`${baseURL}/v1/table/${row.getValue("id")}`),
                    icon: "material-symbols:qr-code"
                }),
                h(DeleteModal, { id: row.getValue("id"), type: "table", fetchData })
            )
        }
    },
]

onMounted(async () => {
    fetchData()
});

definePageMeta({
    layout: 'admin'
})


</script>
