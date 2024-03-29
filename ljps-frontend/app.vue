<script setup>
	const route = useRoute();
</script>

<template>
	<NuxtLayout data-theme="corporate">
		<Head>
			<Title>{{ route.meta.title }}</Title>
			<Meta :name="route.meta.title"/>
		</Head>
		<NuxtLoadingIndicator />
		<NuxtPage data-theme="corporate" />
	</NuxtLayout>
</template>
