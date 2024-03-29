<script setup>
const props = defineProps({
    learningJourneyID: {
        type: Number,
        required: true,
    },
    course: {
        type: Object,
        required: true,
    },
    index: {
        type: Number,
        required: true,
    },
});
</script>

<script>
export default {
    data: function () {
        return {
            errorMessage: false,
            body: "",
        };
    },
    methods: {
        async deleteCourse(courseID, JourneyID,fun) {
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
            refreshNuxtData('learningJourneys')
        },

    },
};
</script>

<template>
    <div class="md:card-compact card-bordered bg-base-100">
        <div class="card-body">
            <div
                class="grid desktop:grid-cols-8 laptop:grid-cols-8 tablet:grid-cols-5 phone:grid-cols-1 gap-8"
            >
                <div
                    class="desktop:col-span-6 laptop:col-span-6 tablet:col-span-3 phone:col-span-1"
                >
                    <h4 class="card-title">
                        {{ course.CourseName }}
                    </h4>
                    <p
                        class="text-red-500 text-xl"
                        v-show="errorMessage"
                    >
                        Learning Journey must have at least one course
                    </p>
                </div>
                <div
                    class="card-actions mt-5 ml-10 laptop:col-span-1 tablet:col-span-2 phone:col-span-1"
                >
                    <div class="card-actions mr-5">
                        <label
                            :for="'delete'  + learningJourneyID + index"
                            class="btn btn-danger rounded-md md:btn-md btn-outline"
                            >Delete</label
                        >
                        <input
                            type="checkbox"
                            :id="'delete' + learningJourneyID + index"
                            class="modal-toggle"
                        />
                        <div class="modal">
                            <div class="modal-box w-11/12 max-w-5xl relative">
                                <label
                                    :for="'delete' + learningJourneyID + index"
                                    class="btn btn-sm btn-circle absolute right-2 top-2"
                                    >✕</label
                                >
                                <h1 class="text-2xl font-bold">
                                    Are you sure you want to delete -
                                    {{ course.CourseName }}?
                                </h1>
                                <div class="modal-action">
                                    <label
                                        :for="'delete' + learningJourneyID  + index"
                                        class="btn btn-danger rounded-md md:btn-md btn-outline bottom-0 right-0"
                                        @click="
                                                deleteCourse(
                                                    course.CourseID,
                                                    props.learningJourneyID)
                                        "
                                    >
                                        Delete
                                    </label>
                                    <label
                                        :for="'delete' + index"
                                        class="btn btn-danger rounded-md md:btn-md btn-outline bottom-0 right-0"
                                    >
                                        Cancel
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
