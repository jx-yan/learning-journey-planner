<script setup>
const props = defineProps({
    // Props here
    coursename: { type: String, required: true },
    courseID: { type: Number, required: true },
    journeyID: { type: Number, required: true },

});
// const emit = defineEmits(["remove"]);

let coursename = props.coursename;
let journeyID = props.journeyID;
let courseID = props.courseID;
// console.log(coursename);
// console.log(courseID);
// console.log(journeyID);

</script>

<template>
    <div class="modal modal-open">
        <div class="modal-box w-11/12 max-w-5xl">
            <button for="my-modal-3" class="btn btn-sm btn-circle absolute right-2 top-2 btn-outline btn-error"
                @click="$emit('close-modal')">
                ✕
            </button>
            <h3 v-if="courseID == 8511" class="font-bold my-4">
                Are you sure you want to remove this Learning Journey?
            </h3>
            <h3 v-else class="font-bold my-4">
                Are you sure you want to remove '{{coursename}}' course from your Learning Journey?
            </h3>
            <div class="divider my-2"></div>
            <div class="flex justify-center">
                <button class=" btn btn-square mr-4" @click="$emit('close-modal')">
                    No
                </button>
                <button class="btn btn-square btn-outline" @click="$emit('close-modal'); remove(courseID, journeyID)">
                    Yes
                </button>
            </div>
        </div>
    </div>

</template>
<script>
export default {
    data: function () {
        return {
            body: "",
        };
    },
    methods: {
        async remove(courseID, JourneyID) {
            if (courseID == 8511) {
                this.$emit('removejourney', JourneyID);
            }
            else {
                let formData = { JourneyID: JourneyID, CourseID: courseID };
                this.$emit('remove', formData);
            }

        },


    },
};
</script>
