<script setup>
import { compileScript } from '@vue/compiler-sfc';

const props = defineProps({
    // Props here
    jobselected: {
        type: Object,
        required: true,
    },
});
const { data } = await useFetch(`http://localhost:5000/courses/all`);
var courses = data.value;
const skillsRequired = computed(() => {
    return props.jobselected.SkillsRequired.map((skill) => {
        return skill;
    });
});
const staffID = useCookie("staffID");
const staffName = useCookie("staffName");
const skillSelected = ref(null);
var openCourseModal = ref(false);
var RelevantCourses = [];
var skillSwitch = ref(false);
var coursesSelected = ref([]);
// var componentKey = ref(0);
var courseClicked = ref(false);
console.log(courseClicked.value);

const clickCourse = () => {
    courseClicked.value = !courseClicked.value;
};

const openCourses = (skill) => {
    // componentKey.value++;
    // console.log(componentKey);
    console.log(skill);
    // coursesSelected.value = [];
    skillSelected.value = skill.SkillName;
    // skillSwitch.value = skill.SkillID;
    openCourseModal.value = true;
    RelevantCourses.length = 0;
    for (let course of courses) {
        let arrayofSkills = course.Skills;
        for (let skillsets of arrayofSkills) {
            if (skillsets.SkillName == skillSelected.value) {
                RelevantCourses.push(course);
            }
        }
    }


    // console.log(props.jobselected);
};

// const chooseCourse = (courseInfo) => {
//     if (!coursesSelected.includes(courseInfo.CourseID)) {
//         coursesSelected.push(courseInfo.CourseID);
//     } else {
//         coursesSelected.splice(coursesSelected.indexOf(courseInfo.CourseID), 1);
//     }
//     console.log(coursesSelected);

// };

var createLearningJourneyData = reactive({
    JourneyName:
        staffName.value + "'s Learning Journey for " + props.jobselected.JobName,
    JourneyDesc:
        staffName.value +
        "created this learning journey for " +
        props.jobselected.JobName,
    JobID: props.jobselected.JobID,
    StaffID: staffID.value,
    Courses: coursesSelected,
});

let createLearningJourney = () => {
    if (
        confirm(
            `You are about to set ${props.jobselected.JobName} as your new learning journey\n\n You selected courseID(s): ${createLearningJourneyData.Courses}\n\n Click Ok to confirm.`
        )
    ) {
        try {
            $fetch(`http://localhost:5000/journey/add`, {
                method: "POST",
                body: JSON.stringify(createLearningJourneyData),
            }).then((res) => {
                if (res.error) {
                    alert(res.error);
                } else {
                    alert("Learning Journey Created Successfully!");
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
            <label for="my-modal-3" class="btn btn-sm btn-circle absolute right-2 top-2 btn-outline btn-error"
                @click="$emit('close-modal')">✕</label>
            <h3 class="font-bold my-4">Set Learning Goal</h3>
            <div class="divider my-2"></div>
            <h4 class="font-bold my-4">
                Job Selected:
                <span class="text-primary-focus">{{ jobselected.JobName }}</span>
            </h4>
            <button class="btn btn-active btn-primary float-right" @click="createLearningJourney">
                Set new learning journey
            </button>
            <h4 class="font-bold mt-5 mb-4">
                Skills Required
                <span class="m-0 font-thin text-xs">- Click on the skill to add courses</span>
            </h4>
            <div class="flex-row flex-wrap">
                <button class="flex-initial rounded-full bg-blue-300 px-4 py-2 text-sm font-bold mr-4 mb-2"
                    v-for="skill in skillsRequired" @click="openCourses(skill)">
                    {{ skill.SkillName }}
                </button>
                <div>
                    <h4 class="font-bold mt-5 mb-5">
                        Course Offered for:
                        <span class="text-info">{{ skillSelected }}</span>
                    </h4>
                    <div v-if="openCourseModal"
                        class="grid grid-cols-2 laptop:grid-cols-2 tablet:grid-cols-2 phone:grid-cols-1 megaphone:grid-cols-1 gap-4">
                        <!-- <BaseCourses v-for="courseInfo in RelevantCourses" :courseInfo="courseInfo"
                            :skillSwitch="skillSwitch" @click="chooseCourse(courseInfo)" /> -->
                        <div v-for="courseInfo in RelevantCourses" @click="chooseCourse(courseInfo, coursesSelected)">
                            <div class="card p-5 cursor-pointer shadow-md bg-base-300"
                                v-if="coursesSelected.includes(courseInfo.CourseID)">
                                <div class="card-body p-0 bg-base-300 m-auto" :key="componentKey">
                                    <h4 class="m-0">{{ courseInfo["CourseName"] }}</h4>
                                    <p class="text-sm m-0">{{ courseInfo["CourseDesc"] }}</p>
                                    <div class="card-actions justify-end"></div>
                                </div>
                            </div>
                            <div v-else class="card p-5 cursor-pointer shadow-md bg-base-100">
                                <div class="card-body p-0" :key="componentKey">
                                    <h4 class="m-0">{{ courseInfo["CourseName"] }}</h4>
                                    <p class="text-sm m-0">{{ courseInfo["CourseDesc"] }}</p>
                                    <div class="card-actions justify-end"></div>
                                </div>
                            </div>




                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>



<script>
export default {
    data() {
        return {
            componentKey: 0,
        };
    },
    methods: {
        async chooseCourse(courseInfo, coursesSelected) {
            if (!coursesSelected.includes(courseInfo.CourseID)) {
                coursesSelected.push(courseInfo.CourseID);
                this.componentKey++;

            } else {
                coursesSelected.splice(coursesSelected.indexOf(courseInfo.CourseID), 1);
            }
            console.log(coursesSelected);
        },
    },
};
</script>



