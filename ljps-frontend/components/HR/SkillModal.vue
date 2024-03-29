<script setup>
const props = defineProps({
  // Props here
  jobselected: {
    type: Object,
    required: true,
  },
});

var skillRequired = [];
const skillsRequired = computed(() => {
  return props.jobselected.SkillsRequired.map((skill) => {
    skillRequired.push({ skillID: skill.SkillID, skillName: skill.SkillName });
    return skill.SkillName;
  });
});

const skillsRemaining = computed(() => {
  let database = [];
  const { data: allSkills } = useFetch("http://localhost:5000/skills/all");
  let skills = allSkills.value;
  for (let each of skills) {
    
    if (each.SkillStatus){
      database.push({ skillID: each.SkillID, SkillName: each.SkillName });
    }
    
  }
  for (let each2 of skillRequired) {
    let index = database.findIndex((x) => x.skillID === each2.skillID);
    database.splice(index, 1);
  }

  return database;
});

var editMode = ref(false);
const toeditMode = () => {
  editMode.value = !editMode.value;
};

var thingsToEdit = reactive({
  nameChange: props.jobselected.JobName,
  descChange: props.jobselected.JobDesc,
  skillsToAdd: [],
  skillsToRemove: []
});

const updateJob = () => {
  // console.log(thingsToEdit);
  if (
    confirm(
      `You have entered:\n\nJob Name: ${thingsToEdit.nameChange}\n\nYou have entered a new description: ${thingsToEdit.descChange}\n\nAdding these skills: ${thingsToEdit.skillsToAdd}\n\nRemoving these skills: ${thingsToEdit.skillsToRemove}\n\nClick Ok to confirm.`
    )
  ) { 
    try {
      $fetch(
        `http://localhost:5000/jobs/editJobDetails/${props.jobselected.JobID}`,
        {
          method: "PUT",
          body: JSON.stringify(thingsToEdit),
        }
      ).then((res) => {
        if (res.error) {
          alert(res.error);
        } else {
          alert("Job Edited successfully!");
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
      <div v-show="!editMode">
        <label
          class="btn btn-sm btn-circle absolute right-2 top-2 btn-outline btn-error"
          @click="$emit('close-modal')"
          >✕</label
        >
        <h3 class="font-bold my-4">Job Information</h3>
        <div class="divider my-2"></div>
        <button class="float-right btn btn-outline btn-primary" @click="toeditMode">
          Edit Job
        </button>
        <h4 class="font-bold my-4">
          Job Selected:
          <span class="text-primary-focus">{{ jobselected.JobName }}</span>
        </h4>

        <h4 class="font-bold mt-5 mb-4">Skills Required for Job</h4>
        <div class="flex-row flex-wrap">
          <button
            class="flex-initial rounded-full bg-blue-300 px-4 py-2 text-sm font-bold mr-4 mb-2"
            v-for="skill in skillsRequired"
          >
            {{ skill }}
          </button>
        </div>
      </div>

      <div v-show="editMode">
        <label
          class="btn btn-sm btn-circle absolute right-2 top-2 btn-outline btn-error"
          @click="$emit('close-modal')"
          >✕</label
        >
        <h3 class="font-bold my-4">Edit Job Skills</h3>
        <div class="divider my-2"></div>

        <button class="float-right" @click="toeditMode">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#000000"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M11 17l-5-5 5-5M18 17l-5-5 5-5" />
          </svg>
          <path d="M15 18l-6-6 6-6" />
        </button>
        <h4 class="font-bold my-4">Edit Job Name</h4>

        <input
          type="text"
          :placeholder="jobselected.JobName"
          class="input input-bordered w-full max-w-xs  dark:placeholder-gray-400 placeholder:text-sm "
          v-model="thingsToEdit.nameChange"
        />
        <p>
          <h4 class="font-bold my-4">Edit Job Description</h4>
          
          <textarea v-model="thingsToEdit.descChange" rows="4" class="block p-2.5 w-full text-sm text-black bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 bg-white-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Enter new job description"></textarea>
        </p>
        <div>
          <h4 class="font-bold mt-5 mb-4 text-green-600">
            Add these skills to <b class="text-lg">{{ jobselected.JobName }}</b>
            
          </h4>
          <div class="flex flex-row flex-wrap">
            <div
              v-for="skill in skillsRemaining"
              class="flex flex-row items-center justify-center m-2"
            >
              <input
                type="checkbox"
                class="checkbox checkbox-primary checkbox-xs"
                :value="skill.skillID"
                v-model="thingsToEdit.skillsToAdd"
              />
              <label class="text-sm font-medium ml-2">{{
                skill.SkillName
              }}</label>
            </div>
          </div>

          <h4 class="font-bold mt-5 mb-4 text-red-600">
            Remove these skills from <b class="text-lg">{{ jobselected.JobName }}</b>
            
          </h4>
          <div class="flex flex-row flex-wrap">
            <div
              v-for="skill in skillRequired"
              class="flex flex-row items-center justify-center m-2"
            >
              <input
                type="checkbox"
                class="checkbox checkbox-primary checkbox-xs"
                :value="skill.skillID"
                v-model="thingsToEdit.skillsToRemove"
              />
              <label class="text-sm font-medium ml-2">{{
                skill.skillName
              }}</label>
            </div>
          </div>
          <div>
            <button
              @click="updateJob"
              class="float-right btn btn-primary btn-sm rounded-lg"
            >
              Confirm Edit
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
