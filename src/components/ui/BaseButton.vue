<template>
    <button
        :class="[
            'px-6 py-2 rounded-xl font-bold shadow transition',
            color === 'primary' ? 'bg-primary text-white hover:bg-lime-400' : '',
            color === 'accent' ? 'bg-accent text-white hover:bg-purple-400' : '',
            color === 'white' ? 'bg-white text-dark hover:bg-gray-100' : '',
            $attrs.class
        ]"
        v-bind="$attrs"
    >
        <slot />
    </button>
</template>

<script setup lang="ts">
defineProps<{ color?: 'primary' | 'accent' | 'white' }>();
</script>

<script lang="ts">
export default {
    name: 'BaseButton'
}
</script>