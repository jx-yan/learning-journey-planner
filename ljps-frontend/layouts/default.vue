<script setup>
	const route = useRoute();
	useHead({
		meta: [{ name: `${route.meta.title}` }],
	});
</script>

<template>
	<div class="prose max-w-none h-screen">
		<slot />
	</div>
</template>
