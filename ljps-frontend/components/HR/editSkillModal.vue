<script setup>
const props = defineProps({
    // Props here
    skill: {
        type: Object,
        required: true,
    },
});

var skillItemToEdit = reactive({
    skillNameChange: "",
    skillDescriptionChange: "",
});

const editSkill = () => {
    if (
        confirm(
            `You have entered:\n\nSkill Name: ${skillItemToEdit.skillNameChange}\n\nYou have entered a new description: ${skillItemToEdit.skillDescriptionChange}\n\nClick Ok to confirm.`
        )
    ) {
        try {
            $fetch(
                `http://localhost:5000/skills/update/${props.skill.SkillName}`,
                {
                    method: "PUT",
                    body: JSON.stringify(skillItemToEdit),
                }
            ).then((res) => {
                if (res.error) {
                    alert(res.error);
                } else {
                    alert("Skill Edited successfully!");
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
    <div class="modal modal-open" id="editSkillModal">
        <div class="modal-box w-11/12 max-w-5xl">
            <h3 class="font-bold my-4">Skill Information</h3>
            <label
                for="editSkillModal"
                class="btn btn-sm btn-circle absolute right-2 top-2 btn-outline btn-error"
                @click="$emit('close')"
                >✕</label
            >
            <div class="divider my-2"></div>
            <form class="form-control" @submit="editSkill">
                <h4 class="font-bold my-4">Edit Skill Name</h4>
                <input
                    type="text"
                    :placeholder="skill.SkillName"
                    class="input input-bordered w-full max-w-xs dark:placeholder-gray-400 placeholder:text-sm"
                    v-model="skillItemToEdit.skillNameChange"
                    required
                />

                <h4 class="font-bold my-4">Edit Job Description</h4>

                <textarea
                    v-model="skillItemToEdit.skillDescriptionChange"
                    rows="4"
                    class="block p-2.5 w-full text-sm text-black bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 bg-white-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    :placeholder="skill.SkillDesc"
                    required
                ></textarea>
                <p></p>
                <div>
                    <button
                        type="submit"
                        class="float-right btn btn-primary btn-sm rounded-lg"
                    >
                        Confirm Edit
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>
