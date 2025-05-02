<template>

    <div>
        <header class="border-b-1 border-slate-700">
            <UContainer>
                <div class="flex items-center justify-between py-4">
                    <h1 class="text-xl font-semibold">{{ $t("adminDashboard") }}</h1>
                    <div>
                        <span>{{ $t("welcomeAdmin") }}</span>
                    </div>
                </div>
            </UContainer>
        </header>
        <UContainer class="flex">
            <aside class="w-64 hidden xl:block">
                <div class="p-4 text-2xl font-bold">Admin Panel</div>
                <UTree v-model="activeNav" :items="routes" size="xl" />
            </aside>
            <UTabs v-model="active" variant="pill" class="gap-4 w-full block xl:hidden fixed bottom-0.5 left-0 z-50"
                size="xl" :ui="{ trigger: 'flex-1' }" :items="items" :content="false">
            </UTabs>
            <div class="flex flex-col flex-1">
                <main class="p-6">
                    <slot></slot>
                    <Loader v-if="isLoading" />
                </main>
            </div>
        </UContainer>
    </div>

</template>
<script setup>
import { useRouter } from 'nuxt/app'
const router = useRouter()
const active = ref()
const activeNav = ref()
import { ref, watch } from 'vue'
import Loader from '~/components/Loader.vue'
const { locale, t } = useI18n()


const isLoading = ref(false)

const simulateLoading = async () => {
    isLoading.value = true
    await new Promise(resolve => setTimeout(resolve, 500))
    isLoading.value = false
}
const { colorMode, applyTheme } = useTheme()

onMounted(() => {
    applyTheme(colorMode.value)
    simulateLoading()
})


const routes = ref([
    {
        path: "/admin/dashboard",
        label: t('dashboard'),
        icon: 'mage:dashboard',
    },
    {
        path: "/admin/tables",
        label: t('table'),
        icon: 'material-symbols:table-bar-rounded',
    },
    {
        path: "/admin/category",
        label: t("categorie"),
        icon: 'tabler:category-filled',
    },
    {
        path: "/admin/food",
        label: t("food"),
        icon: 'mdi:food',
    },
    {
        path: "/admin/order",
        label: t("order"),
        icon: 'garden:shopping-cart-fill-12',
    },
    {
        path: "/admin/feedback",
        label: t("feedback"),
        icon: 'garden:speech-bubble-plain-fill-12',
    },
    {
        path: "/admin/staff",
        label: t("staff"),
        icon: 'material-symbols:person-2-rounded',
    },
    {
        path: "/admin/settings",
        label: t("settings"),
        icon: 'material-symbols-light:settings',
    }
])

const items = JSON.parse(JSON.stringify(routes.value))

const changeLabel = (newValue) => items.map((e, i) => e?.path == newValue ? e.label = routes.value[i].label : e.label = '')
const getCurrent = () => String(routes.value.findIndex((e) => "/" + locale.value + e.path === router.currentRoute.value.path))

active.value = getCurrent()
activeNav.value = items[getCurrent()]

const changeLabelNav = () => {
    active.value = routes.value.findIndex(e => e?.label == activeNav?.value?.label)
}
changeLabel(activeNav.value?.path)

watch(active, (newValue) => {
    changeLabel(routes.value[newValue].path)
    routes.value.forEach((e, i) => {
        if (newValue == i) {
            router.push(`/${locale.value + e.path}`)
        }
    })
})

watch(activeNav, (newValue) => {
    changeLabelNav(newValue)
    changeLabel(newValue)
    routes.value.forEach((e) => {
        if (newValue == e.path) {
            router.push(`/${locale.value + e.path}`)
        }
    })
})

</script>