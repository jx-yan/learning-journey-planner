<script setup>
var showModal = ref(false);
var showRemoveModal = ref(false);

const props = defineProps({
    // Props here
    course: {
        type: Object,
        required: true,
    },
    journeyid: {
        type: Number,
    },
});
// console.log(props.journeyid);

let coursename = props.course.CourseName;
let courseDesc = props.course.CourseDesc;
let courseID = props.course.CourseID;
let skills = props.course.Skills;
let journeyid = props.journeyid;

// for (let skill in skills) {
//     console.log(skills[skill].SkillName);
// }

const toggleModal = () => {
    showModal.value = !showModal.value;
};
const toggleRemoveModal = () => {
    showRemoveModal.value = !showRemoveModal.value;
};
</script>
<template>
    <div
        class="collapse collapse-arrow border border-base-300 bg-base-100 mt-4 rounded-lg"
    >
        <input type="checkbox" />
        <div class="collapse-title">
            <h3 class="mt-0 inline-block">{{ coursename }}</h3>
            <h4>Description:</h4>
            <p class="m-0 text-md">
                {{ courseDesc }}
            </p>
        </div>
        <div class="grid grid-rows-1 items-end">
            <button
                v-if="journeyid != undefined"
                class="btn btn-outline btn-primary justify-self-end m-4 rounded-lg"
                @click="toggleRemoveModal"
            >
                Remove Course from Learning Journey
            </button>
            <button
                v-else
                class="btn btn-outline btn-primary justify-self-end m-4 rounded-lg"
                @click="toggleModal"
            >
                Add/Remove Skills
            </button>
            <Courses-HRmodal
                v-if="showModal"
                @close-modal="toggleModal"
                :skills="skills"
                :coursename="coursename"
                :courseID="courseID"
            />
            <Courses-removeHRmodal
                v-if="showRemoveModal"
                @close-modal="toggleRemoveModal"
                @remove="remove($event)"
                :coursename="coursename"
                :courseID="courseID"
                :journeyID="journeyid"
            />
        </div>
        <div class="collapse-content">
            <h4 class="inline-block my-3">Skills Gained:</h4>
            <div class="flex-row flex-wrap">
                <label
                    class="flex-initial rounded-full bg-white hover:bg-black-400 hover:text-white text-black px-3 text-sm font-normal mr-4 mb-2 btn modal-button"
                    v-for="skill in skills"
                    :for="skill.SkillID"
                    @click="sendInfo(skill)"
                >
                    {{ skill.SkillName }}
                </label>
            </div>
            <input
                type="checkbox"
                :id="passedData.SkillID"
                class="modal-toggle"
            />
            <div class="modal">
                <div class="modal-box relative">
                    <label
                        :for="passedData.SkillID"
                        class="btn btn-sm btn-circle absolute right-2 top-2"
                        >✕</label
                    >
                    <h3 class="text-lg font-bold">
                        {{ passedData.SkillName }}
                    </h3>
                    <p class="py-4">
                        {{ passedData.SkillDesc }}
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            passedData: "",
            errorMessage: false,
            body: "",
        };
    },
    methods: {
        sendInfo(skill) {
            // console.log(skill);
            this.passedData = skill;
        },
        async deleteCourse(courseID, JourneyID) {
            let formData = { JourneyID: JourneyID, CourseID: courseID };

            let res = await $fetch(
                "http://localhost:5000/journey/deletecourse",
                {
                    method: "PUT",
                    body: formData,
                }
            );
            if (res.error) {
                this.errorMessage = true;
            }
            refreshNuxtData("learningJourneys");
        },
        remove(result) {
            // console.log("heyllo", result);
            this.$emit("remove", result);
        },
    },
};
</script>
