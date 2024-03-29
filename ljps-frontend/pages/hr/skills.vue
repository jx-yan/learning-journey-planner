<script setup>
definePageMeta({
    title: "Skills | HR",
    layout: "hr",
});

var skills = ref(null);
const { data } = await useFetch(`http://localhost:5000/skills/all`);
skills = data.value;

var skillCreationData = reactive({
    skillName: null,
    skillDesc: null,
});

let createSkill = () => {
    if (
        confirm(
            `You have entered:\n\nSkill Name: ${skillCreationData.skillName}\n\nJob Description: ${skillCreationData.skillDesc}\n\nClick Ok to confirm.`
        )
    ) {
        try {
            $fetch(`http://localhost:5000/skills/add`, {
                method: "POST",
                body: JSON.stringify(skillCreationData),
            }).then((res) => {
                if (res.error) {
                    alert(res.error);
                } else {
                    alert("Skill created successfully!");
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
            <h2 class="m-[3vh]">Skills</h2>
            <div class="grow"></div>
            <label
                for="createSkillModal"
                class="btn modal-button btn-outline btn-primary md:btn-md rounded-lg m-[2vh]"
                >Create New Skill</label
            >
        </div>

        <div class="divider"></div>
        <div class="alert shadow-lg bg-blue-50" v-if="skills == null">
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
                <span>No Skills found</span>
            </div>
        </div>
        <div
            class="grid grid-cols-1 laptop:grid-cols-3 tablet:grid-cols-2 phone:grid-cols-1 megaphone:grid-cols-1 gap-4"
        >
            <HRSkillCard v-for="skill in skills" :skill="skill" />
        </div>

        <input type="checkbox" id="createSkillModal" class="modal-toggle" />

        <div class="modal">
            <div class="modal-box max-w-[90vw] max-h-[90vh]">
                <label
                    for="createSkillModal"
                    class="btn btn-sm btn-circle absolute right-2 top-2 btn-outline btn-error"
                    >✕</label
                >
                <h2 class="font-bold my-2">Create New Skill</h2>
                <div class="divider"></div>

                <!-- Create Job Form -->
                <form class="form-control" @submit="createSkill">
                    <h4 class="font-bold my-4">Enter Skill Name</h4>
                    <input
                        type="text"
                        placeholder="Enter Skill Name"
                        class="input input-bordered w-full max-w-xs placeholder:text-gray-800 placeholder:text-sm placeholder:font-medium text-sm font-medium"
                        v-model="skillCreationData.skillName"
                        required
                    />

                    <h4 class="font-bold my-4">Enter Skill Description</h4>

                    <textarea
                        placeholder="Enter Skill Description"
                        class="textarea textarea-bordered w-full max-w-screen-desktop text-sm font-medium placeholder:text-gray-800 placeholder:text-sm placeholder:font-medium"
                        v-model="skillCreationData.skillDesc"
                        required
                    ></textarea>

                    <div class="flex flex-row justify-end mt-4">
                        <button
                            type="submit"
                            class="btn btn-primary btn-sm rounded-lg"
                        >
                            Create Skill
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>
