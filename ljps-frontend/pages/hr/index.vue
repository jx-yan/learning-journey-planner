<script setup>
	definePageMeta({
		title: "Home | HR",
		layout: "hr",
	});
</script>

<template>
	<div class="flex flex-col h-5/6">
		<NuxtLink to="/" class="text-end mx-[5vh] my-[4vh] no-underline">
			<button class="btn btn-outline">Return to Main</button>
		</NuxtLink>
		<div class="grow"></div>
		<h2 class="m-0 text-center p-10 drop-shadow-2xl">
			Welcome to Learning Journey Planning System
		</h2>
		<div class="grow"></div>
		<div class="grid place-content-center">
			<label
				for="my-drawer"
				class="btn btn-primary max-w-fit min-w-max drawer-button justify-self-center"
			>
				Click Here to Navigate
			</label>
		</div>
		<div class="grow"></div>
		<h3 class="m-0 text-center p-10">
			Logged in as
			<span class="text-success drop-shadow-2xl">Human Resources</span>
		</h3>
	</div>
</template>
