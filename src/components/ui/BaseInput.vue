<template>
    <div>
        <label v-if="label" :for="id" class="block mb-1 text-sm font-medium text-gray-700">{{ label }}</label>
        <input
            :id="id"
            :type="type"
            v-model="inputValue"
            :placeholder="placeholder"
            :disabled="disabled"
            class="w-full px-4 py-2 rounded-xl bg-grayLight border-none focus:ring-2 focus:ring-primary text-dark placeholder-grayText"
        />
    </div>
</template>

<script setup lang="ts">
import { ref, watch, defineProps, defineEmits } from 'vue';

const props = defineProps<{
    modelValue: string,
    label?: string,
    id?: string,
    type?: string,
    placeholder?: string,
    disabled?: boolean
}>();
const emit = defineEmits(['update:modelValue']);

const inputValue = ref(props.modelValue);

watch(() => props.modelValue, (val) => {
    inputValue.value = val;
});

watch(inputValue, (val) => {
    emit('update:modelValue', val);
});
</script>

<script lang="ts">
export default {
    name: 'BaseInput'
}
</script>