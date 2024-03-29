<script setup>
	definePageMeta({
    title: "Jobs | Staff",
		layout: "staff",
	});

	var jobs = ref(null);

	const { data } = await useFetch(`http://localhost:5000/jobs/allactive`);
	jobs = data.value;
</script>

<template>
	<div class="mx-12 divide-solid">
		<h2 class="mt-12 p-5">Jobs</h2>

		<div class="divider"></div>
		<div class="alert shadow-lg bg-blue-50" v-if="jobs == null">
			<div>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					class="stroke-info flex-shrink-0 w-6 h-6"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
					></path>
				</svg>
				<span>No Jobs found</span>
			</div>
		</div>
		<div
			class="grid grid-cols-1 laptop:grid-cols-3 tablet:grid-cols-2 phone:grid-cols-1 megaphone:grid-cols-1 gap-4"
		>
			<base-job-card v-for="job in jobs" :job="job" />
		</div>
	</div>
</template>
