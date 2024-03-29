<script setup>
definePageMeta({
    title: "Learning Journeys | Staff",
    layout: "staff",
});
var showModal = ref(false);
var showRemoveModal = ref(false);

var id = useCookie('staffID');
var staffCode = useCookie('staffCode');

var mylearningjourney = ref(null);
const { data: alllearningjourney } = await useFetch(`http://localhost:5000/journey/all/${id.value}`, { method: "GET", initialCache: false });
const { data: allStaffSkills } = await useFetch(
    `http://localhost:5000/staff/search/${staffCode.value}/skills`, { method: "GET", initialCache: false }
);

// console.log(allStaffSkills._value);
mylearningjourney = alllearningjourney.value;
// console.log(mylearningjourney);

const toggleModal = () => {
    showModal.value = !showModal.value;
};
const toggleRemoveModal = () => {
    showRemoveModal.value = !showRemoveModal.value;
};

</script>

<script>
export default {
    el: "#tollBtns",
    data: function () {
        return {
            activeBtn: null,
            activeSkill: false,
            activeCourse: false,
            journeyname: "",
            allskillrequired: null,
            skillslearnt: 0,
            coursesadded: 0,
            acquired: [],
            notacquired: [],
            courses: [],
            componentKey: 0,
            status: null,
            hideToast: true,
            toastMessage: "",
            success: false,
            tempjourneyid: null,
            tempjourney: null,
            mylearningjourney: null,
        };
    },
    methods: {
        async activebtn(journey, allStaffSkills) {
            // console.log(journey);
            // console.log(journey.Courses);
            this.tempjourneyid = journey.JourneyID;
            const { data } = await useFetch(`http://localhost:5000/journey/all/${useCookie("staffID").value}`, { method: "GET", initialCache: false });
            for (let journey of data.value) {
                if (journey.JourneyID == this.tempjourneyid) {
                    this.tempjourney = journey;
                    break;
                }
            }
            this.activeSkill = false;
            this.activeCourse = false;
            this.skillslearnt = 0;
            this.coursesadded = 0;
            this.activeBtn = this.tempjourney.JourneyID;
            this.allskillrequired = this.tempjourney.Job.SkillsRequired;
            this.journeyname = this.tempjourney.Job.JobName;
            this.classifySkill(allStaffSkills);
            this.getcourse(this.tempjourney.Courses);
        },
        classifySkill(staffacquiredskills) {
            // console.log(staffacquiredskills);
            this.acquired = [];
            this.notacquired = [];
            for (let skill of this.allskillrequired) {
                let found = false;
                // console.log(skill.SkillName);
                for (let acquiredskill of staffacquiredskills) {
                    // console.log(requiredSkill.SkillName);
                    if (skill.SkillID == acquiredskill.SkillID) {
                        found = true;
                        break;
                    }
                }
                if (found) {
                    this.acquired.push(skill);
                } else {
                    this.notacquired.push(skill);
                }
            }
            // console.log(this.acquired);
            // console.log(this.notacquired);
            this.skillslearnt = this.acquired.length;
        },
        activeskill(bool) {
            this.activeCourse = false;
            this.activeSkill = bool;
        },
        activecourse(bool) {
            this.activeSkill = false;
            this.activeCourse = bool;
        },
        async getcourse(courses) {
            this.courses = [];
            this.coursesadded = courses.length;
            for (let course of courses) {
                // console.log("courses:", course);
                // console.log(course.CourseID);
                const { data } = await useFetch(`http://localhost:5000/courses/search/${course.CourseID}`, { method: "GET", initialCache: false });
                // console.log(data._value);
                this.courses.push(data._value);
            }
            this.componentKey++;
            // console.log(this.courses);
        },
        async remove(formData) {
            // console.log(formData);
            this.status = null;
            try {
                let res = await $fetch(
                    "http://localhost:5000/journey/deletecourse",
                    {
                        method: "PUT",
                        body: formData, initialCache: false
                    }
                );
                if (res.error) {
                    this.status = false;
                    this.toastMessage = "Course failed to be removed!";
                    this.showToast();
                }
                else {
                    this.status = true;
                    this.toastMessage = "Course removed successfully!";
                    const { data } = await useFetch(`http://localhost:5000/journey/all/${useCookie("staffID").value}`, { method: "GET", initialCache: false });
                    for (let journey of data._value) {
                        if (journey.JourneyID == this.activeBtn) {
                            this.getcourse(journey.Courses);
                            break;
                        }
                    }
                    this.showToast();
                }
            }
            catch (err) {
                // console.log(err);
            }

        },
        showToast() {
            this.success = true;
            setTimeout(() => {
                this.success = false;
            }, 5000);
            // window.location.reload();

        },
        async removejourney(formData) {
            // console.log(formData);
            this.status = null;
            try {
                let res = await $fetch(
                    "http://localhost:5000/journey/delete/" + formData,
                    {
                        method: "Delete", initialCache: false
                    }
                );
                if (res.error) {
                    this.status = false;
                    this.toastMessage = "Journey failed to be removed!";
                    this.showToast();
                }
                else {
                    this.status = true;
                    this.toastMessage = "Journey removed successfully!";
                    const { data } = await useFetch(`http://localhost:5000/journey/all/${useCookie("staffID").value}`, { method: "GET", initialCache: false });
                    this.mylearningjourney = data._value;
                    this.componentKey++;
                    this.activeBtn = null;
                    this.showToast();
                }
            }
            catch (err) {
                // console.log(err);
            }

        },

    },
};
</script>

<template>
    <div class="divide-solid mx-12">
        <div class="flex tablet:flex-row phone:flex-col justify-between">
            <div class="order-last self-center mt-12 mb-5">
                <NuxtLink to="/staff/jobs" class="no-underline">
                    <button class="btn btn-outline btn-primary justify-self-end rounded-lg">
                        Start a new learning journey
                    </button>
                </NuxtLink>
            </div>
            <div class="self-center mt-12 mb-5">
                <h2 class="m-0">Your Learning Journeys</h2>
            </div>
        </div>
        <div class="divider"></div>
        <div class="alert shadow-lg bg-blue-50" v-if="!mylearningjourney || mylearningjourney.error"
            :key="componentKey">
            <div>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                    class="stroke-info flex-shrink-0 w-6 h-6">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span>No learning journey found.</span>
            </div>
        </div>

        <div v-else
            class="flex laptop:flex-row phone:flex-col laptop:space-x-8 min-h-[calc(100vh_-300px)] laptop:max-h-[calc(100vh_-300px)]">
            <div class="laptop:basis-1/3 border border-base-300 bg-base-100 rounded-box mt-4 shadow-xl overflow-y-auto">
                <ul class="menu bg-base-100 p-2 rounded-box">
                    <!-- <MyLearningJourneyCard v-for="course in mylearningjourney" /> -->
                    <li v-for="journey in mylearningjourney" :class="{ bordered: activeBtn === journey.JourneyID }"
                        :key="journey.JourneyID">
                        <button class="flex justify-between font-bold text-lg"
                            @click="activebtn(journey, allStaffSkills)">
                            {{ journey.Job.JobName }}
                            <div class="font-semibold text-base text-slate-600">View</div>
                        </button>
                    </li>

                </ul>
            </div>
            <div class="laptop:basis-2/3 border border-base-300 bg-base-100 rounded-box mt-4 shadow-xl"
                v-if="activeBtn != null">
                <div class="flex tablet:flex-row phone:flex-col justify-between">
                    <div class="order-last tablet:mt-5 phone:mt-0">
                        <button class="btn btn-outline btn-primary justify-self-end m-4 rounded-lg"
                            @click="toggleRemoveModal">
                            Remove learning journey
                        </button>
                        <Courses-removemodal v-if="showRemoveModal" @close-modal="toggleRemoveModal"
                            :coursename="journeyname" :courseID="8511" :journeyID="activeBtn"
                            @removejourney="removejourney($event)" />
                    </div>
                    <div>
                        <h2 class="mt-5 p-5 pb-0">{{ journeyname }}</h2>
                    </div>
                </div>
                <div class="flex tablet:flex-row phone:flex-col">
                    <div class="flex p-5 flex-col">
                        <div class="border-2 border-base-300 bg-base-100 rounded-lg p-3 tablet:w-40">
                            <div class="font-normal">Skills Learnt</div>
                            <div class="mt-5 font-bold text-3xl" :key="componentKey">{{ skillslearnt }}</div>
                            <button class="mt-5 font-medium underline float-right text-slate-600"
                                @click="activeskill(true)">
                                View Skills
                            </button>
                        </div>
                        <div class="border-2 border-base-300 bg-base-100 rounded-lg p-3 mt-5 tablet:w-40">
                            <div class="font-normal">Course</div>
                            <div class="mt-5 font-bold text-3xl">{{ coursesadded }}</div>
                            <button class="mt-5 font-medium underline float-right text-slate-600"
                                @click="activecourse(true)">
                                View Courses
                            </button>
                        </div>
                    </div>
                    <div class="p-5 w-full" v-if="activeSkill != false">
                        <div class="p-5 border-2 border-base-300 bg-base-100 rounded-lg">
                            <div class="flex justify-between tablet:flex-row phone:flex-col">
                                <div class="font-bold text-lg underline">Skills Required</div>
                                <!-- <div class="phone:mt-5 tablet:mt-0">
                                    <FilterButton placeholder="Skill Status" />
                                </div> -->
                            </div>
                            <div
                                class="mt-0 min-h-[calc(100vh_-_380px)] yj:max-h-[calc(100vh_-_580px)] laptop:max-h-[calc(100vh_-_380px)] overflow-y-auto ">
                                <ul class="menu bg-base-100 rounded-lg pl-0 my-0 text-lg pr-4">
                                    <div>
                                        <li class="menu-title p-0">
                                            <span class="p-0">Not Acquired</span>
                                        </li>
                                        <li class="p-0" v-for="skill in notacquired">
                                            <a class="p-0 rounded-lg no-underline py-1 flex justify-between">
                                                <div>{{ skill.SkillName }}</div>
                                                <NuxtLink
                                                    :to="{ path: '/staff/courses', query: { skillID: skill.SkillID } }"
                                                    class="no-underline">
                                                    <div class="font-semibold text-base text-slate-600">Explore</div>
                                                </NuxtLink>
                                            </a>
                                        </li>


                                        <li class=" menu-title p-0">
                                            <span class="p-0">Acquired</span>
                                        </li>
                                        <li class="p-0" v-for="skill in acquired">
                                            <a class="p-0 rounded-lg no-underline py-1 flex justify-between">
                                                <div>{{ skill.SkillName }}</div>
                                            </a>
                                        </li>
                                    </div>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div class="p-5 w-full" v-if="activeCourse != false">
                        <div class="p-5 border-2 border-base-300 bg-base-100 rounded-lg">
                            <div class="flex justify-between tablet:flex-row phone:flex-col">
                                <div class="font-bold text-lg underline">Added Courses</div>
                                <!-- <div class="phone:mt-5 tablet:mt-0">
                                    <FilterButton placeholder="Course Status" />
                                </div> -->
                            </div>
                            <div
                                class="mt-0 min-h-[calc(100vh_-_380px)] yj:max-h-[calc(100vh_-_580px)] laptop:max-h-[calc(100vh_-_380px)] overflow-y-auto ">
                                <CoursesCourseCard :key="course.CourseID" v-for="course in courses" :course="course"
                                    :journeyid='activeBtn' @remove="remove($event)" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <ToastComment v-if="success" :toast-message="toastMessage" :status="status" />

        </div>
    </div>
</template>
