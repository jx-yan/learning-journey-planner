<script setup>
	const props = defineProps({
		job: {
			type: Object,
			required: true,
		},
	});

	const jobSkills = computed(() => {
		return props.job.SkillsRequired.map((skill) => {
			return skill.SkillName;
		});
	});

	var showModal = ref(false);

	const toggleModal = () => {
		showModal.value = !showModal.value;
	};

	let toggleJob = () => {
		if (props.job.JobStatus == true) {
			if (confirm("Are you sure you want to deactivate this job?")) {
				try {
					$fetch("http://localhost:5000/jobs/toggle-id/" + props.job.JobID, {
						method: "PUT",
					}).then((res) => {
						if (res.error) {
							throw new Error(res.error);
						} else {
							alert("Job deactivated successfully");
							window.location.reload();
						}
					});
				} catch (error) {
					throw new Error(res.error);
				}
			}
		} else {
			if (confirm("Are you sure you want to activate this job?")) {
				try {
					$fetch("http://localhost:5000/jobs/toggle-id/" + props.job.JobID, {
						method: "PUT",
					}).then((res) => {
						if (res.error) {
							alert("Error activating job");
						} else {
							alert("Job activated successfully");
							window.location.reload();
						}
					});
				} catch (error) {
					throw new Error(res.error);
				}
			}
		}
	};
</script>

<template>
	<div class="grid max-w-none shadow-lg rounded-md">
		<div class="collapse collapse-arrow">
			<input type="checkbox" class="peer" />
			<div class="collapse-title peer-checked:text-secondary-content">
				<h3 class="mt-0 inline-block">{{ job.JobName }}</h3>
				<h4>Description:</h4>
				<p class="m-0 text-sm">
					{{ job.JobDesc }}
				</p>
			</div>
			<div class="flex flex-row flex-wrap justify-end content-end">
				<p
					class="text-sm m-0 font-bold text-success mt-auto mb-[2.5vh] mr-[2vw] ml-5"
					v-if="job.JobStatus"
				>
					Active
				</p>
				<p
					class="text-sm m-0 font-bold text-error mt-auto mb-[2.5vh] mr-[2vw] ml-5"
					v-else
				>
					Disabled
				</p>
				<div class="grow"></div>
				<button
					class="btn btn-sm btn-outline btn-secondary justify-self-end mt-auto mb-[2vh] mr-[2vw]"
					@click="toggleModal"
				>
					Edit
				</button>
				<button
					class="btn btn-sm btn-outline btn-error justify-self-end mt-auto mb-[2vh] mr-[2vw]"
					@click="toggleJob"
					v-if="job.JobStatus"
				>
					Deactivate
				</button>
				<button
					class="btn btn-sm btn-outline btn-success justify-self-end mt-auto mb-[2vh] mr-[2vw]"
					@click="toggleJob"
					v-else
				>
					Activate
				</button>
				<HRSkillModal
					v-if="showModal"
					:jobselected="job"
					@close-modal="toggleModal"
				/>
			</div>
			<div class="collapse-content peer-checked:text-secondary-content">
				<h4 class="inline-block my-3">Skills Required:</h4>
				<div class="flex-row flex-wrap">
					<button
						class="flex-initial rounded-full bg-blue-300 px-4 py-2 text-sm font-bold mr-4 mb-2"
						v-for="skill in jobSkills"
					>
						{{ skill }}
					</button>
				</div>
			</div>
		</div>
	</div>
</template>
