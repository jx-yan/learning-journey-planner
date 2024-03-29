<script setup>
	definePageMeta({
		title: "Home | Staff",
		layout: "staff",
	});

	const { data: allStaffRef } = await useFetch(
		`http://localhost:5000/staff/all`
	);
	var allStaff = allStaffRef.value;
	let selectedStaff = ref(null);
	const staffID = useCookie("staffID");
	const staffCode = useCookie("staffCode");
	const staffName = useCookie("staffName");
	const loginState = useCookie("loginState");

	let changeStaff = (staff) => {
		staffID.value = staff.StaffID;
		staffName.value = staff.Staff_FName + " " + staff.Staff_LName;
		staffCode.value = staff.StaffCode;
		loginState.value = "Logged In";
		window.location.reload();
	};

	let logOut = () => {
		staffID.value = null;
		staffName.value = null;
		staffCode.value = null;
		loginState.value = null;
		window.location.reload();
	};
</script>

<template>
	<div class="flex flex-col h-5/6">
		<NuxtLink to="/" class="text-end mx-[5vh] my-[4vh] no-underline">
			<button class="btn btn-outline">Return to Main</button>
		</NuxtLink>
		<div class="grow"></div>
		<h2 class="m-0 text-center p-10">
			Welcome to Learning Journey Planning System
		</h2>
		<h3 class="m-0 text-center p-10">
			<p v-if="loginState !== 'Logged In'">Select a Staff to Log In</p>
			<p v-else>Logged In as {{ staffName }}</p>
			<select
				class="select select-primary ml-2 min-w-auto"
				v-model.lazy="selectedStaff"
				@change="changeStaff(selectedStaff)"
				v-if="allStaff !== null && loginState !== 'Logged In'"
			>
				<option disabled selected value="">Select Staff</option>
				<option :value="staffObj" v-for="staffObj in allStaff">
					{{ staffObj.Staff_FName + " " + staffObj.Staff_LName }}
				</option>
			</select>
			<p v-if="allStaff == null" class="text-info">No Staff is found</p>
			<button
				class="btn btn-warning"
				v-if="loginState === 'Logged In'"
				@click="logOut"
			>
				Log Out
			</button>
		</h3>
		<!-- <div class="grid place-content-center p-10">
			<label
				for="my-drawer"
				class="btn btn-primary max-w-full drawer-button justify-self-center"
			>
				Click Here to Navigate
			</label>
		</div> -->
		<div class="grow"></div>
		<div class="grow"></div>
	</div>
</template>
