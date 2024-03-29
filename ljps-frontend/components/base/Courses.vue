<script setup>
const props = defineProps({
	// Props here
	courseInfo: {
		type: Object,
		required: true,
	},
	skillID: {
		type: Boolean,
		required: true,
	},
});
console.log(props.skillID);

var courseClicked = ref(false);
console.log(courseClicked.value);

const clickCourse = () => {
	courseClicked.value = !courseClicked.value;
};
</script>

<template>
	<div v-if="props.skillID == false" class="card p-5 cursor-pointer shadow-md " @click="clickCourse"
		:class="courseClicked ? 'bg-base-300' : 'bg-base-100'">
		<div class=" card-body p-0">
			<h4 class="m-0">{{ courseInfo["CourseName"] }}</h4>
			<p class="text-sm m-0">{{ courseInfo["CourseDesc"] }}</p>
			<div class="card-actions justify-end"></div>
		</div>
	</div>

</template>
