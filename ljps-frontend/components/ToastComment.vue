<script setup>
const props = defineProps({
    toastMessage: {
        type: String,
    },
    status: {
        type: Boolean,
    }
});
</script>

<template>
    <div class="toast toast-start">
        <div v-if="props.status == true" class="alert alert-success">
            <div class="mx-auto">
                <span>
                    {{ props.toastMessage }}
                </span>
            </div>
        </div>
        <div v-if="props.status == false" class="alert alert-error">
            <div class="mx-auto">
                <span>
                    {{ props.toastMessage }}
                </span>
            </div>
        </div>
    </div>
</template>

<style>

</style>