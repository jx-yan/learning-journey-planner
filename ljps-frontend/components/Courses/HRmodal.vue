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

// get the passed skill into modal
// compare skill in above comment with fetch all skills
// splice all the skills from 2nd array that are in the first array
// return the remaining skills

const getRemainingSkills = computed(() => {
    let database = [];
    const { data: allSkills } = useFetch(`http://localhost:5000/skills/all`);
    let skills = allSkills.value;
    for (let each of skills) {
        database.push({ skillID: each.SkillID, SkillName: each.SkillName });
    }
    for (let each2 of props.skills) {
        let index = database.findIndex((x) => x.skillID === each2.SkillID);
        database.splice(index, 1);
    }

    return database;
});

var skillsToedit = reactive({
    skillsToAddToCourse: [],
    skillsToRemoveFromCourse: [],
});

const updatecourse = () => {
    // console.log(skillsToedit);
    if (
        confirm(
            `You are about to add skill ids: ${skillsToedit.skillsToAddToCourse} \nand\nRemove skill ids:${skillsToedit.skillsToRemoveFromCourse}\n\n from ${props.coursename}`
        )
    ) {
        try {
            $fetch(
                `http://localhost:5000/courses/editCourseDetails/${props.courseID}`,
                {
                    method: "PUT",
                    body: JSON.stringify(skillsToedit),
                }
            ).then((res) => {
                if (res.error) {
                    alert(res.error);
                } else {
                    alert("Course Edited successfully!");
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
    <div class="modal modal-open">
        <div class="modal-box w-11/12 max-w-5xl">
            <button
                for="my-modal-3"
                class="btn btn-sm btn-circle absolute right-2 top-2 btn-outline btn-error"
                @click="$emit('close-modal')"
            >
                ✕
            </button>
            <h3 class="font-bold my-4">
                <b style="color: green">Add</b>/
                <b style="color: red">Remove</b> Skills for
                {{ coursename }}
            </h3>
            <div class="divider my-2"></div>

            <h4 class="font-bold my-4">Skills To Add:</h4>
            <div class="flex flex-row flex-wrap">
                <div
                    v-for="skill in getRemainingSkills"
                    class="flex flex-row items-center justify-center m-2"
                >
                    <input
                        type="checkbox"
                        class="checkbox checkbox-primary checkbox-xs"
                        :value="skill.skillID"
                        v-model="skillsToedit.skillsToAddToCourse"
                    />
                    <label class="text-sm font-medium ml-2">{{
                        skill.SkillName
                    }}</label>
                </div>
            </div>
            <h4 class="font-bold mt-5 mb-4">Skills To Remove:</h4>
            <div class="flex flex-row flex-wrap">
                <div
                    v-for="skill in props.skills"
                    class="flex flex-row items-center justify-center m-2"
                >
                    <input
                        type="checkbox"
                        class="checkbox checkbox-primary checkbox-xs"
                        :value="skill.SkillID"
                        v-model="skillsToedit.skillsToRemoveFromCourse"
                    />
                    <label class="text-sm font-medium ml-2">{{
                        skill.SkillName
                    }}</label>
                </div>
            </div>
            <button
                @click="updatecourse"
                class="float-right btn btn-primary btn-sm rounded-lg"
            >
                Confirm Edit
            </button>
        </div>
    </div>
</template>
