<template>
    <div class="container mt-5">
      <div class="row">
        <div class="col-md-12">
          <h5 class="mb-4">Student List</h5>
          <table class="table table-striped table-hover">
            <thead class="thead-dark">
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="student in students" :key="student.id">
                <td>{{ student.name }}</td>
                <td>{{ student.email }}</td>
                <td>
                  <button class="btn btn-primary" @click="viewDetails(student)">
                    View Details
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
  
      <!-- Display quiz details if available -->
      <div v-if="quizDetails && selectedStudent">
        <h5 class="mt-4">Assigned Quizzes for {{ selectedStudent.name }}</h5>
        <table class="table table-bordered">
          <thead class="thead-dark">
            <tr>
              <th>Quiz Name</th>
              <th>Marks</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="quiz in quizDetails" :key="quiz.id">
              <td>{{ quiz.quiz_name }}</td>
              <td>{{ quiz.marks_obtained }} / {{ quiz.total_marks }}</td>
              <td>{{ quiz.status }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import { useAuthStore } from '@/stores/authStore';
  
  const authStore = useAuthStore();
  const students = ref([]);
  const quizDetails = ref(null); // Store quiz details here
  const selectedStudent = ref(null); // Store the selected student here
  
  // Fetch student data on mount
  onMounted(async () => {
    try {
      const studentsResponse = await authStore.fetchStudents();
      students.value = studentsResponse.data;
    } catch (error) {
      console.error('Failed to fetch students:', error);
    }
  });
  
  // Fetch quiz details for the selected student
  const viewDetails = async (student) => {
    selectedStudent.value = student; // Save the selected student
    console.log(`Fetching quiz details for student: ${student.name} (${student.id})`); // Debug log
  
    try {
      const quizzes = await authStore.getUserAssignedQuizByUserIdApi(student.id); // Pass student id to API
      quizDetails.value = quizzes; // Store the returned quiz details
      console.log('Fetched quiz details:', quizzes); // Debug log
    } catch (error) {
      console.error('Failed to fetch quizzes for student:', student, error);
      quizDetails.value = null; // Clear the quiz details on error
    }
  };
  </script>
  
  <style scoped>
  .table {
    width: 100%;
    margin: auto;
    border-collapse: collapse;
  }
  
  .table th,
  .table td {
    padding: 12px;
    text-align: left;
  }
  
  .table th {
    color: black;
  }
  
  .table-hover tbody tr:hover {
    background-color: #f5f5f5;
  }
  
  .btn {
    padding: 5px 10px;
    font-size: 14px;
  }
  </style>
  