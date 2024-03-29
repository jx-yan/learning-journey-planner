<script setup>
	definePageMeta({
		title: "Home | LJPS",
	});
	const route = useRoute();
	useHead({
		meta: [{ name: `${route.meta.title}` }],
	});
</script>

<template>
	<div class="flex flex-col gap-8 h-5/6 place-items-center justify-center">
		<h1 class="m-0 text-center pb-12">Choose Account Type</h1>

		<NuxtLink to="/staff" class="no-underline">
			<button class="btn btn-info">I am a Staff</button>
		</NuxtLink>
		<NuxtLink to="/hr" class="no-underline">
			<button class="btn btn-success">I am a Human Resources Staff</button>
		</NuxtLink>
		<NuxtPage />
	</div>
</template>
