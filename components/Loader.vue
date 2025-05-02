<template>
    <div class="fixed inset-0 flex justify-center items-center backdrop-blur-md bg-opacity-50 z-50">
        <div class="spinner-border animate-spin border-t-transparent border-4 rounded-full w-16 h-16 border-blue-500">
        </div>
    </div>
</template>

<style scoped>
.spinner-border {
    border-color: transparent transparent var(--ui-primary);
    border-radius: 50%;
    width: 3rem;
    height: 3rem;
    border-width: 0.25em;     
}
</style>