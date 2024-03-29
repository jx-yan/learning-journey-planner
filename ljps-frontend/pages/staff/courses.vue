<script setup>
definePageMeta({
	title: "Courses | Staff",
	layout: "staff",
});

var courses = ref(null);

const route = useRoute();

const skillfilterid = "skillID" in route.query ? route.query.skillID : null;
// console.log(skillfilterid);

if (skillfilterid != null) {
	const { data } = await useFetch(
		`http://localhost:5000/courses/search/skill/${skillfilterid}`,
		{ method: "GET", initialCache: false }
	);
	courses = data.value;
	// console.log(courses);
} else {
	const { data } = await useFetch(`http://localhost:5000/courses/all`, {
		method: "GET",
		initialCache: false,
	});
	courses = data.value;
}
</script>

<template>
	<div class="divide-solid mx-12">
		<div class="flex flex-row align-items-center mt-[4vh] flex-wrap">
			<h2 class="m-[3vh]">Courses</h2>
			<div class="grow"></div>
		</div>
		<div class="divider"></div>
		<div class="flex phone:flex-col tablet:flex-row">
			<FilterButton class="phone:mt-3 tablet:mt-0" placeholder="Skills" :skillfilterid="skillfilterid"
				@change="changeFilter($event)" />
		</div>
		<div class="alert shadow-lg mt-4" v-if="!courses || courses.error" :key="componentKey">
			<div>
				<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
					class="stroke-info flex-shrink-0 w-6 h-6">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
						d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
				</svg>
				<span>No courses available for selected skill.</span>
			</div>
		</div>
		<div v-else>
			<CoursesCourseCard :key="componentKey" v-for="course in courses" :course="course" />
		</div>
	</div>
</template>

<script>
export default {
	data() {
		return {
			componentKey: 0,
			// courses: { courses: this.courses },
			courses: null,
		};
	},
	methods: {
		async changeFilter(event) {
			try {
				// console.log(this.courses);
				// console.log(event);
				// console.log(typeof event);
				if (typeof event !== "object") {
					if (event === "null" && typeof event == "string") {
						const { data } = await useFetch(
							`http://localhost:5000/courses/all`,
							{ method: "GET", initialCache: false }
						);
						// console.log(data.value);
						this.courses = data.value;
						// console.log(this.courses);
						this.componentKey++;
					} else if (event != "null" && typeof event == "number") {
						const { data } = await useFetch(
							`http://localhost:5000/courses/search/skill/${event}`,
							{ method: "GET", initialCache: false }
						);
						// console.log(data.value);
						this.courses = data.value;
						// console.log(this.courses);
						this.componentKey++;
					}
				}
			} catch (error) {
				// console.log(error);
			}
		},
	},
};
</script>
