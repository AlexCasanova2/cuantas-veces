<template>
  <div class="flex items-center bg-grayLight rounded-xl px-4 py-2 shadow">
    <input
      class="flex-1 bg-transparent border-none outline-none text-dark placeholder-grayText"
      :placeholder="placeholder"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
    />
    <slot name="icon">
      <svg class="w-6 h-6 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    </slot>
  </div>
</template>
<script setup lang="ts">
defineProps<{ placeholder?: string; modelValue: string }>();
defineEmits(['update:modelValue']);
</script> 