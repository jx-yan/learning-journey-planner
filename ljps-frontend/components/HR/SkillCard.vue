<script setup>
import EditSkillModal from "./editSkillModal.vue";

const props = defineProps({
    // Props here
    skill: {
        type: Object,
        required: true,
    },
});

var showSkilleditModal = ref(false);

const toggleModal = () => {
    showSkilleditModal.value = !showSkilleditModal.value;
};

let activateSkill = () => {
    if (confirm("Are you sure you want to activate this skill?")) {
        try {
            $fetch(
                "http://localhost:5000/skills/active/" + props.skill.SkillName,
                {
                    method: "Put",
                }
            ).then((res) => {
                if (res.error) {
                    alert("Error activating skill");
                } else {
                    alert("Skill activated successfully");
                    window.location.reload();
                }
            });
        } catch (error) {
            alert(error);
        }
    }
};

let deactivateSkill = () => {
    if (confirm("Are you sure you want to deactivate this skill?")) {
        try {
            $fetch(
                "http://localhost:5000/skills/softdelete/" +
                    props.skill.SkillName,
                {
                    method: "Put",
                }
            ).then((res) => {
                if (res.error) {
                    alert("Error deactivating skill");
                } else {
                    alert("Skill deactivated successfully");
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
    <div class="grid max-w-none shadow-lg rounded-md">
        <div class="skill-title p-5">
            <h3 class="mt-0 inline-block">{{ skill.SkillName }}</h3>
            <p class="m-0 text-sm text-secondary-focus" v-if="skill.SkillDesc">
                {{ skill.SkillDesc }}
            </p>
            <p v-else class="m-0 text-sm font-thin text-error">
                No description
            </p>
        </div>

        <div class="flex flex-row justify-end content-end">
            <div class="flex shrink mt-auto mb-[2.5vh] ml-5">
                <h4
                    class="m-0 text-primary drop-shadow-2xl"
                    v-if="skill.SkillStatus == true"
                >
                    Active
                </h4>
                <h4
                    class="m-0 text-error drop-shadow-2xl"
                    v-if="skill.SkillStatus == false"
                >
                    Disabled
                </h4>
            </div>
            <div class="grow"></div>
            <div class="flex">
                <button
                    class="btn btn-sm btn-outline btn-secondary justify-self-end mt-auto mb-[2vh] mr-[2vw]"
                    @click="toggleModal"
                >
                    Edit
                </button>
                <button
                    class="btn btn-sm btn-outline btn-primary justify-self-end mt-auto mb-[2vh] mr-5"
                    @click="activateSkill"
                    v-if="skill.SkillStatus == false"
                >
                    Activate
                </button>

                <button
                    class="btn btn-sm btn-outline btn-error justify-self-end mt-auto mb-[2vh] mr-5"
                    @click="deactivateSkill"
                    v-if="skill.SkillStatus == true"
                >
                    Deactivate
                </button>
            </div>
            <div v-if="showSkilleditModal">
                <editSkillModal :skill="skill" @close="toggleModal" />
            </div>
        </div>
    </div>
</template>
