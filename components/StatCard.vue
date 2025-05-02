<template>
    <div class="p-5 rounded-xl shadow flex items-center space-x-4">
        <div class="text-3xl">
            {{ icon }}
        </div>
        <div>
            <div class="text-sm">{{ title }}</div>
            <div class="text-xl font-bold">{{ value }}</div>
        </div>
    </div>
</template>

<script setup>
defineProps({
    title: String,
    value: String,
    icon: String
})
</script>