<script setup>
	definePageMeta({
		title: "Jobs | HR",
		layout: "hr",
	});

	var jobs = ref(null);
	const { data } = await useFetch(`http://localhost:5000/jobs/all`);
	jobs = data.value;

	const { data: allSkills } = await useFetch(
		`http://localhost:5000/skills/allactive`
	);
	var skills = allSkills.value;

	const { data: allDepts } = await useFetch(`http://localhost:5000/depts/all`);
	var depts = allDepts.value;

	var jobCreationData = reactive({
		jobDeptId: null,
		jobName: null,
		jobDesc: null,
		jobSkills: [],
	});

	let createJob = () => {
		if (
			confirm(
				`You have entered:\n\nJob Name: ${jobCreationData.jobName}\n\nJob Description: ${jobCreationData.jobDesc}\n\nClick Ok to confirm.`
			)
		) {
			try {
				$fetch(`http://localhost:5000/jobs/add`, {
					method: "POST",
					body: JSON.stringify(jobCreationData),
				}).then((res) => {
					if (res.error) {
						alert(res.error);
					} else {
						alert("Job created successfully!");
						window.location.reload();
					}
				});
			} catch (error) {
				alert(error);
			}
		}
	};
</script>

<template>
	<div class="mx-12 divide-solid">
		<div class="flex flex-row align-items-center mt-[4vh] flex-wrap">
			<h2 class="m-[3vh]">Jobs</h2>
			<div class="grow"></div>
			<label
				for="createJobModal"
				class="btn modal-button btn-outline btn-primary md:btn-md rounded-lg m-[2vh]"
				>Create New Job</label
			>
		</div>
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
			<HRJobCard v-for="job in jobs" :job="job" />
		</div>
		<input type="checkbox" id="createJobModal" class="modal-toggle" />

		<div class="modal">
			<div class="modal-box max-w-[90vw] max-h-[90vh]">
				<label
					for="createJobModal"
					class="btn btn-sm btn-circle absolute right-2 top-2 btn-outline btn-error"
					>✕</label
				>
				<h2 class="font-bold my-2">Create New Job</h2>
				<div class="divider"></div>

				<!-- Create Job Form -->

				<form class="form-control" @submit="createJob">
					<h4 class="font-bold mb-4 mt-0">Choose Department</h4>

					<select
						class="select select-ghost select-bordered w-full max-w-xs placeholder:text-slate-400 text-sm"
						v-model="jobCreationData.jobDeptId"
						required
					>
						<option disabled selected class="text-slate-400 select-ghost">
							Select a Department
						</option>
						<option :value="dept.DeptID" v-for="dept in depts">
							{{ dept.DeptName }}
						</option>
					</select>

					<h4 class="font-bold my-4">Enter Job Name</h4>

					<input
						type="text"
						placeholder="Enter a Job Name"
						class="input input-bordered w-full max-w-xs placeholder:text-gray-800 placeholder:text-sm placeholder:font-medium text-sm font-medium"
						v-model="jobCreationData.jobName"
						required
					/>

					<h4 class="font-bold my-4">Enter Job Description</h4>

					<textarea
						placeholder="Enter a Job Description"
						class="textarea textarea-bordered w-full max-w-screen-desktop text-sm font-medium placeholder:text-gray-800 placeholder:text-sm placeholder:font-medium"
						v-model="jobCreationData.jobDesc"
						required
					></textarea>

					<h4 class="font-bold my-4">Add Skills Required</h4>

					<div class="flex flex-row flex-wrap">
						<div
							v-for="skill in skills"
							class="flex flex-row items-center justify-center m-2"
						>
							<input
								type="checkbox"
								class="checkbox checkbox-primary checkbox-xs"
								:value="skill.SkillID"
								v-model="jobCreationData.jobSkills"
							/>
							<label class="text-sm font-medium ml-2">{{
								skill.SkillName
							}}</label>
						</div>
					</div>

					<div class="flex flex-row justify-end mt-4">
						<button type="submit" class="btn btn-primary btn-sm rounded-lg">
							Create Job
						</button>
					</div>
				</form>
			</div>
		</div>
	</div>
</template>
