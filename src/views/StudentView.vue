<!-- src/views/StudentView.vue -->
<template>
  <div>
     <!-- Navbar -->
     <nav class="navbar navbar-expand-lg navbar-light bg-light">
      <div class="container-fluid">
        <!-- Adjusted Logout button with hover effect -->
        <button class="btn btn-danger logout-btn" @click="handleLogout">Logout</button>
      </div>
    </nav>
    <div>
      <StudentQuizdetails/>
      <Quizresults/>

     
    </div>
  </div>
  </template>
  
  <script>
  import StudentQuizdetails from '@/components/StudentQuizdetails.vue';
  import Quizresults from '@/components/Quizresults.vue';
  
  export default {
    name: 'StudentView',
    components:{
      StudentQuizdetails,
      Quizresults
    },

    setup() {
      const handleLogout = () => {
      authStore.logout();  // Call the Pinia logout function
      router.push('/login');  // Redirect to the login page
    };

    return { handleLogout };
    }
  

    
  };
  </script>
  

  <style scoped>
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