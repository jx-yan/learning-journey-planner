<script setup lang="ts">
// interface Props {
//   placeholder?: string;
//   skillfilterid?: number;
// }
var allskills = ref(null);
// const props = defineProps<Props>();
const { data } = await useFetch(`http://localhost:5000/skills/all`);
allskills = data.value;


</script>
<template>
  <div class="form-control" :required="true" @change.stop="changeContent">
    <select class="select select-bordered w-full max-w-xs rounded-lg" v-model='selected'>
      <option :selected="skillfilterid === null" value=null>{{ placeholder }}: All</option>
      <option v-for="skills in allskills" v-bind:value="skills.SkillID" :selected="skills.SkillID == skillfilterid">
        {{skills.SkillName}}</option>
    </select>
  </div>
</template>
<script lang="ts">
export default {
  // props: ['placeholder', 'skillfilterid'],
  props: {
    placeholder: {
      type: String,
      default: 'Skills',
    },
    skillfilterid: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      selected: this.skillfilterid,
    };
  },
  methods: {
    changeContent() {
      this.$emit('change', this.selected);
    },
  },
};
</script>

