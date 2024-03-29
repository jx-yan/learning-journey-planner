<script setup>
import { getCurrentInstance } from "vue";
const props = defineProps({
    learningJourney: {
        type: Object,
        required: true,
    },
    index: {
        type: Number,
        required: true,
    },
    completedStaffSkills: {
        type: Array,
        required: true,
    },
    requiredStaffSkills: {
        type: Object,
        required: true,
    },
});
</script>

<script>
export default {
    data: function () {
        return {
            showSkillInfo: true,
            showCourseInfo: true,
        };
    },
};
</script>

<template>
    <div class="card-body card-bordered">
        <div
            class="grid laptop:grid-cols-5 tablet:grid-cols-3 phone:grid-cols-1 gap-2"
        >
            <h2
                class="card-title laptop:col-span-4 tablet:col-span-3 phone:col-span-1"
            >
                Learning Journey - {{ learningJourney.Job.JobName }}
            </h2>
            <div class="card-actions mr-2">
                <label
                    :for="'modal' + index"
                    class="btn btn-primary rounded-md mt-10 mr-5 btn-outline col-span-1"
                    >Edit courses</label
                >
                <input
                    type="checkbox"
                    :id="'modal' + index"
                    class="modal-toggle"
                />
                <div class="modal">
                    <div class="modal-box w-11/12 max-w-5xl relative">
                        <label
                            :for="'modal' + index"
                            class="btn btn-sm btn-circle absolute right-2 top-2"
                            >✕</label
                        >
                        <h1 class="text-3xl font-bold">
                            Add Course to Learning Journey -
                            {{ learningJourney.Job.JobName }}
                        </h1>
                        <h3>Unacquired skills</h3>
                        <button
                            class="flex-initial rounded-full bg-red-300 px-4 py-2 text-sm font-bold mr-4 mb-2 mt-2"
                            v-for="skill in learningJourney.Job.SkillsRequired"
                            :key="skill.SkillID"
                        >
                            {{ skill.SkillName }}
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <div
            class="grid laptop:grid-cols-3 tablet:grid-cols-2 phone:grid-cols-1 gap-8"
        >
            <div
                class="card-compact card-bordered bg-base-100 rounded-md phone:col-span-1"
            >
                <h4 class="card-title text-gray-600 ml-6">Skills Learnt</h4>
                <p class="font-bold text-4xl ml-6">
                    {{ props.completedStaffSkills.length }}
                </p>
                <div class="card-actions justify-end">
                    <button
                        @click="showSkillInfo = !showSkillInfo"
                        class="btn text-lg btn-ghost rounded-md mb-5 mr-5"
                    >
                        View
                    </button>
                </div>
            </div>

            <div
                class="card-compact card-bordered bg-base-100 rounded-md phone:col-span-1"
            >
                <h4 class="card-title text-gray-600 ml-6">
                    Courses in learning journey
                </h4>
                <p class="font-bold text-4xl ml-6">
                    {{ learningJourney.Courses.length }}
                </p>
                <div class="card-actions justify-end">
                    <button
                        @click="showCourseInfo = !showCourseInfo"
                        class="btn text-lg btn-ghost rounded-md mb-5 mr-5"
                    >
                        View
                    </button>
                </div>
            </div>

            <div
                v-show="showSkillInfo"
                class="card-compact card-bordered laptop:col-span-6 tablet:col-span-4 phone:col-span-1 bg-base-100 rounded-md"
            >
                <h4 class="card-title text-gray-600 ml-6 underline">Skills</h4>
                <div class="card-compact bg-base-100 ml-12">
                    <h4 class="text-red-500 card-title">Not Acquired</h4>
                    <button
                        class="flex-initial rounded-full bg-red-300 px-4 py-2 text-sm font-bold mr-4 mb-2 mt-2"
                        v-for="skill in requiredStaffSkills"
                        :key="skill.SkillID"
                    >
                        {{ skill.SkillName }}
                    </button>
                    <div v-if="requiredStaffSkills.length == 0">
                        <h4>
                            All related skills acquired
                        </h4>
                    </div>
                </div>

                <div class="card-compact bg-base-100 ml-12 mb-12">
                    <h4 class="text-green-500 card-title">Acquired</h4>
                    <button
                        class="flex-initial rounded-full bg-green-300 px-4 py-2 text-sm font-bold mr-4 mb-2 mt-2"
                        v-for="skill in completedStaffSkills"
                        :key="skill.id"
                    >
                        {{ skill.SkillName }}
                    </button>
                    <div v-if="completedStaffSkills.length == 0">
                        <h4>
                            No related skills acquired
                        </h4>
                    </div>
                </div>
            </div>

            <div
                v-show="showCourseInfo"
                class="card-compact card-bordered laptop:col-span-6 tablet:col-span-4 phone:col-span-1 bg-base-100 rounded-md"
            >
                <div class="flex mb-3">
                    <h4
                        class="in-block underline card-title text-gray-600 ml-6"
                    >
                        Courses
                    </h4>
                </div>
                <LearningJourneyCourseCard
                    v-for="(course, index) in learningJourney.Courses"
                    :key="course.CourseID"
                    :course="course"
                    :learningJourneyID="learningJourney.JourneyID"
                    :index="index"
                />
            </div>
        </div>
    </div>
</template>
