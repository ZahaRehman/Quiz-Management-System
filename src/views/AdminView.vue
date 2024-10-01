<template>
  <div>
    <!-- Navbar -->
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
      <div class="container-fluid">
        <!-- Adjusted Logout button with hover effect -->
        <button class="btn btn-danger logout-btn" @click="handleLogout">Logout</button>
      </div>
    </nav>

    <!-- Main Content -->
    <div class="container my-4">
      <div class="row">
        <div class="col-12">
          <StudentApplications />
        </div>
        <div class="col-12 ">
          <ApprovedStudents />
        </div>
        
        <div class="col-12 ">
          <div class="row">
            <div class="col-lg-4 col-md-6  col-sm-12"><createquiz/></div>
            <div class="col-lg-4 col-md-6 col-sm-12"><RegisterManager /></div>
            <div class="col-lg-4 col-md-6 col-sm-12"><AssignQuiz /></div>
          </div>
        </div>
        <div class="col-12 ">
          <div class="row">
            <div class="col-lg-4 col-md-6  col-sm-12"><AdminStudentResultview/></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useAuthStore } from '@/stores/authStore';
import { useRouter } from 'vue-router';
import StudentApplications from '@/components/StudentApplications.vue';
import ApprovedStudents from '@/components/ApprovedStudents.vue';
import RegisterManager from '@/components/RegisterManager.vue';
import AssignQuiz from '@/components/AssignQuiz.vue';
import createquiz from '@/components/createquiz.vue';
import AdminStudentResultview from '@/components/AdminStudentResultview.vue';
export default {
  components: {
    StudentApplications,
    ApprovedStudents,
    RegisterManager,
    AssignQuiz,
    createquiz,
    AdminStudentResultview
  },
  setup() {
    const authStore = useAuthStore();
    const router = useRouter();

    const handleLogout = () => {
      authStore.logout();  // Call the Pinia logout function
      router.push('/login');  // Redirect to the login page
    };

    return { handleLogout };
  }
}
</script>

<style scoped>
/* Logout button styles */
.logout-btn {
  margin-left: 110px; /* Move the button a bit to the right */
  transition: background-color 0.3s ease, color 0.3s ease; /* Smooth transition for hover */
}

/* Hover effect */
.logout-btn:hover {
  background-color: white;  /* Change background to white */
  color: red;               /* Change text color to red */
  border-color: red;        /* Optional: change border color to red */
}

/* Main container spacing */
.container {
  margin-top: 20px;
}
</style>