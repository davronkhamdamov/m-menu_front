<template>
    <div class="space-y-6">
        <h2 class="text-2xl font-bold mb-8">Umumiy hisobot</h2>
        <h3 class="text-lg font-bold">Bugungi hisobot</h3>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <StatCard title="Buyurtmalar soni" :value="String(dashboard.today_orders)" icon="📦" />
            <StatCard title="Daromat" :value="formatUZS(dashboard.today_revenue) + $t('currency')" icon="💰" />
            <StatCard title="Jami firklar" :value="String(dashboard.total_feedback)" icon="🗣️" />
        </div>
        <div class="grid grid-cols-1 lg:grid-cols-1 gap-6">
            <div class="col-span-2 p-6 rounded-xl shadow">
                <h3 class="text-lg font-semibold mb-2">Sotish haqida haftalik umumiy ma'lumot</h3>
                <div>
                    <Bar :data="chartData" :options="chartOptions" />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { Bar } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'
ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)
const loading = ref(true)
const dashboard = ref({
    total_feedback: 0,
    today_revenue: 0,
    today_orders: 0,
})
const one_week_report = ref([])

const fetchData = async () => {
    loading.value = true
    try {
        const response = await useApiFetch('/v1/dashboard')
        if (response.message != "OK") {
            console.error('Fetch error:', response.message);
        }
        dashboard.value = response?.data;
        one_week_report.value = response?.data?.one_week_report
    } catch (err) {
        console.error('Unexpected error:', err);
    } finally {
        loading.value = false
    }
}
onMounted(async () => {
    await fetchData()
})

const dayNames = ['Dushanba', 'Seshanba', 'Chorshanba', 'Payshanba', 'Juma', 'Shanba', 'Yakshanba']

const weekData = computed(() => {
    return one_week_report.value.map(item => {
        const dayIndex = new Date(item.date).getDay();
        return dayNames[dayIndex];
    });
});

const chartData = computed(() => ({
    labels: weekData.value,
    datasets: [{
        label: 'Kunlik Daromad',
        data: one_week_report.value.map(e => e.total),
        backgroundColor: '#4ade80',
    }]
}));
const chartOptions = {
    responsive: true,
    plugins: { legend: { display: true } }
}


definePageMeta({
    layout: 'admin',
    middleware: 'auth'
})
import StatCard from '~/components/StatCard.vue'
</script>