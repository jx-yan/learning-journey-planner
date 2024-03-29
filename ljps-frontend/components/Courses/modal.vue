<script setup>
const props = defineProps({
    // Props here
    skills: {
        type: Object,
        required: true,
    },

    coursename: { type: String, required: true },
    courseID: { type: Number, required: true },
    value: { type: String, required: false },
});

var id = useCookie('staffID');
// the 2 needs to be change to user ID dynamically after user authentication
const { data: user_learning_journey } = useLazyAsyncData('user_learning_journey', () => $fetch(`http://localhost:5000/journey/all/${id.value}`))
refreshNuxtData('user_learning_journey')
</script>

<template>
    <div class="modal modal-open">
        <div class="modal-box w-11/12 max-w-5xl">
            <button for="my-modal-3" class="btn btn-sm btn-circle absolute right-2 top-2 btn-outline btn-error"
                @click="$emit('close-modal')">
                ✕
            </button>
            <h3 class="font-bold my-4">
                Add {{ coursename }} to your Learning Journey
            </h3>
            <div class="divider my-2"></div>
            <h4 class="font-bold my-4">Select your Learning Journey</h4>
            <select id="learningjourney" class="select select-bordered w-full max-w-xs rounded-lg" v-model="journeyname"
                v-on:change="classifySkill(journeyname, skills)">
                <option value="default" v-bind:selected="value == journeyname">
                    Select Journey
                </option>
                <option v-for="learningjourney in user_learning_journey"
                    v-bind:selected="learningjourney == journeyname" :value="learningjourney">
                    {{ learningjourney.JourneyName }}
                </option>
            </select>

            <h4 class="font-bold mt-5 mb-4">
                Relevant skills that can be acquired through this course for
                your selected Learning Journey:
            </h4>
            <div class="flex-row flex-wrap" v-if="journeyname != 'default'">
                <button class="flex-initial rounded-full bg-green-300 px-4 py-2 text-sm font-bold mr-4 mb-2"
                    v-for="skill in top">
                    {{ skill }}
                </button>
            </div>
            <h4 class="font-bold mt-5 mb-4">
                All other obtainable skills (not required for your selected
                Learning Journey):
            </h4>
            <div class="flex-row flex-wrap" v-if="journeyname == 'default'">
                <button class="flex-initial rounded-full bg-blue-300 px-4 py-2 text-sm font-bold mr-4 mb-2"
                    v-for="skill in skills">
                    {{ skill.SkillName }}
                </button>
            </div>
            <div v-else>
                <button class="flex-initial rounded-full bg-red-300 px-4 py-2 text-sm font-bold mr-4 mb-2"
                    v-for="skill in btm">
                    {{ skill }}
                </button>
            </div>
            <form @submit.prevent="submitform(courseID, journeyname.JourneyID)">
                <div class="grid grid-rows-1 items-end"
                    :class="courseInLearningJourney && journeyname != 'default' ? 'grid-cols-2' : 'grid-cols-1'">
                    <p class="text-red-500 font-bold" v-if="courseInLearningJourney && journeyname != 'default'">
                        {{ coursename }} already in {{ journeyname.JourneyName }}
                    </p>
                    <button :disabled="courseInLearningJourney || journeyname == 'default'"
                        class="btn btn-outline btn-primary justify-self-end m-4 rounded-lg">
                        Add Course
                    </button>

                </div>
            </form>
        </div>
    </div>
</template>
<script>
export default {
    data() {
        return {
            journeyname: "default",
            btm: "",
            top: "",
            courseInLearningJourney: false,
        };
    },

    methods: {
        classifySkill(journeyname, skills) {
            // console.log(journeyname);
            // console.log(journeyname.JourneyID);
            // console.log(journeyname.Job.SkillsRequired);
            // console.log(skills);

            const top = [];
            const btm = [];
            for (let skill of skills) {
                let found = false;
                // console.log(skill.SkillName);
                for (let requiredSkill of journeyname.Job.SkillsRequired) {
                    // console.log(requiredSkill.SkillName);
                    if (skill.SkillName == requiredSkill.SkillName) {
                        found = true;
                        break;
                    }
                }
                if (found) {
                    top.push(skill.SkillName);
                } else {
                    btm.push(skill.SkillName);
                }
            }
            let courseInLearningJourney = false;
            for (let course of journeyname.Courses) {
                if (course.CourseID == this.courseID) {
                    courseInLearningJourney = true;
                }
                this.courseInLearningJourney = courseInLearningJourney;
            }

            // console.log(top);
            // console.log(btm);

            this.btm = btm;
            this.top = top;
        },
        async submitform(courseID, JourneyID) {
            let formData = { JourneyID: JourneyID, CourseID: courseID };

            // console.log(formData);
            let res = await $fetch("http://localhost:5000/journey/addcourse", {
                method: "PUT",
                body: formData,
            });
            this.$emit("close-modal");
            refreshNuxtData('user_learning_journey')
            if (res) {
                alert("Added " + this.coursename + " to " + this.journeyname.JourneyName);
            }

        },
    },
};
</script>
