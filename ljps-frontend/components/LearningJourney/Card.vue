<script setup>
refreshNuxtData('learningJourneys')
const props = defineProps({
    learningJourney: {
        type: Object,
        required: true,
    },
    index: {
        type: Number,
        required: true,
    },
    allStaffSkills: {
        type: Array,
        required: true,
    },
}); 
var completedStaffSkills = [];
var requiredStaffSkills = JSON.parse(JSON.stringify(props.learningJourney.Job.SkillsRequired))

props.allStaffSkills.forEach((skill, i) => {
    props.learningJourney.Job.SkillsRequired.forEach((skillRequired, j) => {
        if (skill.SkillID == skillRequired.SkillID) {
            completedStaffSkills.push(skill);
        }
    });
});

completedStaffSkills.forEach((skill, i) => {
    requiredStaffSkills.forEach((skillRequired, j) => {
        if (skill.SkillID == skillRequired.SkillID) {
            requiredStaffSkills.splice(j, 1);
        }
    });
});
</script>

<script>
export default {
    data: function () {
        return {
            showLearnInfo: false,
        };
    },
    methods: {
        async deleteJourney(JourneyID) {
            // console.log(JourneyID)
            let res = await $fetch(
                "http://localhost:5000/journey/delete/"+JourneyID,
                {
                    method: "Delete",
                }
            );
            if (res.error) {
                this.errorMessage = true;
            }
            refreshNuxtData('learningJourneys')
        },

    },
};
</script>
<template>
    <div
        class="grid laptop:grid-cols-6 tablet:grid-cols-3 phone:grid-cols-1 gap-8"
    >
        <div
            class="laptop:col-span-2 tablet:col-span-3 phone:grid-cols-1 h-fit card bg-base-100 shadow-xl rounded-md hover:overflow-auto"
        >
            <div class="md:card-compact card-bordered bg-base-100">
                <div class="card-body">
                    <div class="grid laptop:grid-cols-3 tablet:grid-cols-3 phone:grid-cols-1 gap-2">
                        <div class="laptop:col-span-2 tablet:col-span-2 phone:col-span-1">
                            <h4 class="card-title">
                                {{ learningJourney.Job.JobName }}
                            </h4>
                            <p class="text-gray-500">
                                Total number of courses -
                                {{ learningJourney.Courses.length }}
                            </p>
                        </div>
                        <div class="card-actions mt-6 ml-5 laptop:col-span-1 tablet:col-span-1 phone:col-span-1">
                            <button
                                class="btn btn-primary rounded-md md:btn-md btn-outline"
                                v-on:click="showLearnInfo = !showLearnInfo"
                            >
                            View
                            </button>

                            <button
                                class="btn btn-danger rounded-md md:btn-md btn-outline"
                                @click="deleteJourney(props.learningJourney.JourneyID)"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div
            class="laptop:col-span-4 tablet:col-span-3 phone:col-span-1 card bg-base-100 shadow-xl rounded-md hover:overflow-auto"
            v-show="showLearnInfo"
        >
            <LearningJourneyCardInfo
                :learningJourney="learningJourney"
                :index="index"
                :allStaffSkills="allStaffSkills"
                :completedStaffSkills="completedStaffSkills"
                :requiredStaffSkills="requiredStaffSkills"
            />
        </div>
    </div>
</template>
