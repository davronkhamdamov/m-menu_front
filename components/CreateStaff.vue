<script setup >
import * as v from 'valibot'

const open = ref(false)
const loading = ref(false)
const { t } = useI18n()
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

const baseSchema = {
    login: v.pipe(v.string(), v.minLength(3, t("login_validation"))),
    role: v.pipe(v.number()),
}

const passwordSchema = props.id
    ? v.optional(
        v.union([
            v.literal(''),
            v.pipe(
                v.string(),
                v.minLength(6, t("password_validation"))
            )
        ])
    )
    : v.pipe(
        v.string(),
        v.nonEmpty(t("password_validation")),
        v.minLength(6, t("password_validation"))
    )

const schema = v.object({
    ...baseSchema,
    password: passwordSchema
})

const items = ref([
    {
        label: 'Admin',
        id: 0
    },
    {
        label: 'Xodim',
        id: 1
    },
])

const state = reactive({
    login: '',
    password: '',
    role: 1
})
const show = ref(false)
const toast = useToast()

async function onSubmit(event) {
    loading.value = true
    try {
        if (props.id) {
            const response = await useApiFetch(`/v1/staff/${props.id}`, '', "PUT", event.data)
            if (response.status >= 400) {
                toast.add({ title: 'Xatolik', description: response.message, color: 'error' })
                return
            }
            open.value = false
            toast.add({ title: 'Mufavaqqiyatli', description: 'Xodim mufavaqqiyatli yangilandi!', color: 'success' })
        } else {
            const response = await useApiFetch("/v1/staff", '', "POST", event.data)
            if (response.status >= 400) {
                toast.add({ title: 'Xatolik', description: response.message, color: 'error' })
                return
            }
            open.value = false
            toast.add({ title: 'Mufavaqqiyatli', description: 'Xodim mufavaqqiyatli yaratildi', color: 'success' })
        }
    } catch (err) {
        console.log(err);
    } finally {
        loading.value = false
        if (props.fetchData) props.fetchData()
    }
}
watch(open, (async () => {
    props.fetchData && props.fetchData()
    if (props.id) {
        const response = await useApiFetch(`/v1/staff/${props.id}`, '', "GET")
        if (response.status >= 400) {
            toast.add({ title: 'Xatolik', description: "Nimadir xatolik ketdi!", color: 'error' })
            return
        }
        state.login = response.data.login
        state.role = response.data.role
    }
}))
</script>

<template>
    <UModal v-model:open="open" :title="$t('add_employee')" :ui="{ footer: 'justify-end' }">
        <UButton v-if="props.id" variant="ghost" icon="hugeicons:edit-02"></UButton>
        <UButton v-else icon="material-symbols:add-2" :label="$t('add_employee')" color="primary" variant="subtle" />
        <template #body>
            <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
                <UFormField :label="$t('enter_login')" name="login" class="w-full">
                    <UInput v-model="state.login" :min="1" :max="50" class="w-full" :placeholder="$t('login')" />
                </UFormField>
                <UFormField :label="$t('enter_role')" name="role" class="w-full">
                    <USelect v-model="state.role" :items="items" class="w-full" value-key="id" />
                </UFormField>
                <UFormField :label="$t('enter_password')" name="password" class="w-full">
                    <UInput v-model="state.password" class="w-full" :placeholder="$t('password')"
                        :type="show ? 'text' : 'password'" :ui="{ trailing: 'pe-1' }">
                        <template #trailing>
                            <UButton color="neutral" variant="link" size="sm"
                                :icon="show ? 'i-lucide-eye-off' : 'i-lucide-eye'"
                                :aria-label="show ? 'Hide password' : 'Show password'" :aria-pressed="show"
                                aria-controls="password" @click="show = !show" />
                        </template>
                    </UInput>
                </UFormField>
                <div class="flex justify-end gap-5">
                    <UButton :label="$t('cancel')" color="neutral" variant="outline" @click="open = false" />
                    <UButton :label="$t('create')" color="neutral" type="submit" :loading="loading" />
                </div>
            </UForm>
        </template>
    </UModal>
</template>
