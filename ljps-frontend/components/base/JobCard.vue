<script setup>
const props = defineProps({
  // Props here
  job: {
    type: Object,
    required: true,
  },
});

const jobSkills = computed(() => {
  return props.job.SkillsRequired.map((skill) => {
    return skill.SkillName;
  });
});

var showModal = ref(false);

const toggleModal = () => {
  showModal.value = !showModal.value;
};
</script>

<template>
  <div class="grid max-w-none shadow-lg rounded-md">
    <div class="collapse collapse-arrow">
      <input type="checkbox" class="peer" />
      <div class="collapse-title peer-checked:text-secondary-content">
        <h3 class="mt-0 inline-block">{{ job.JobName }}</h3>
        <h4>Description:</h4>
        <p class="m-0 text-sm">
          {{ job.JobDesc }}
        </p>
      </div>
      <div class="grid grid-rows-1 items-end">
        <button
          class="btn btn-outline btn-primary justify-self-end m-4"
          @click="toggleModal"
        >
          View Courses Offered
        </button>
        <base-ls-modal
          v-if="showModal"
          :jobselected="job"
          @close-modal="toggleModal"
        />
      </div>
      <div class="collapse-content peer-checked:text-secondary-content">
        <h4 class="inline-block my-3">Skills Required:</h4>
        <div class="flex-row flex-wrap">
          <button
            class="flex-initial rounded-full bg-blue-300 px-4 py-2 text-sm font-bold mr-4 mb-2"
            v-for="skill in jobSkills"
          >
            {{ skill }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
