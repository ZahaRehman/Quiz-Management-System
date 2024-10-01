<template>
  <div class="container mt-5">
    <div class="row">
      <div class="col-md-12 mb-4">
        <div class="card h-100 shadow-sm" @click="showModal = true">
          <div class="card-body d-flex flex-column justify-content-between">
            <h5 class="card-title">Assign Quiz </h5>
            <p class="card-text mb-2">Click to Assign a new quiz.</p>
            <button class="btn assign-btn">Assign Quiz</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal -->
    <div v-if="showModal" class="modal fade show d-block" tabindex="-1" role="dialog">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header justify-content-center">
            <h5 class="modal-title modal-title-custom">Assign Quiz to Students</h5>
            <button type="button" class="btn-close" @click="showModal = false" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <!-- Select Students with Checkboxes -->
            <div class="mb-4">
              <label for="selectedStudent" class="form-label" style="color: #9427ce;">Select Students</label>
              <div id="selectedStudent">
                <div v-for="student in students" :key="student.id" class="form-check">
                  <input 
                    type="checkbox" 
                    :id="'student-' + student.id" 
                    class="form-check-input"
                    :value="student.id" 
                    v-model="selectedStudents" 
                  />
                  <label :for="'student-' + student.id" class="form-check-label">
                    {{ student.name }}
                  </label>
                </div>
                <p v-if="selectedStudents.length === 0" class="text-muted mt-2">Please select at least one student</p>
              </div>
            </div>

            <!-- Quiz Title Dropdown -->
            <div class="mb-4">
              <label for="quizTitle" class="form-label" style="color: #9427ce;">Select Quiz</label>
              <select v-model="quizTitle" id="quizTitle" class="form-select rounded-dropdown">
                <option disabled value="">Please select a quiz</option>
                <option v-for="quiz in quizzes" :key="quiz.id" :value="quiz.id">
                  {{ quiz.quiz_name }}
                </option>
              </select>
            </div>

            <!-- Assign Quiz Button -->
            <button @click="assignQuiz" class="btn btn-assign" :disabled="!selectedStudents.length || !quizTitle">
              Assign Quiz
            </button>

            <!-- Success/Error Messages -->
            <p v-if="successMessage" class="text-success mt-3">{{ successMessage }}</p>
            <p v-if="errorMessage" class="text-danger mt-3">{{ errorMessage }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Backdrop -->
    <div v-if="showModal" class="modal-backdrop fade show"></div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useAuthStore } from '@/stores/authStore';

const authStore = useAuthStore();
const students = ref([]);
const quizzes = ref([]);
const selectedStudents = ref([]); // Array to hold selected student IDs
const quizTitle = ref('');
const successMessage = ref('');
const errorMessage = ref('');
const showModal = ref(false);

onMounted(async () => {
  try {
    const studentsResponse = await authStore.fetchStudents();
    students.value = studentsResponse.data;

    const quizzesResponse = await authStore.fetchQuizes();
    quizzes.value = quizzesResponse.data;
  } catch (error) {
    console.error('Failed to fetch data:', error);
  }
});

const assignQuiz = async () => {
  if (selectedStudents.value.length === 0 || !quizTitle.value) {
    errorMessage.value = 'Please select at least one student and a quiz.';
    return;
  }

  try {
    const payload = {
      user_ids: selectedStudents.value,
      quiz_id: quizTitle.value,
    };

    const response = await authStore.assignQuizapi(payload);
    if (response && response.success) {
      successMessage.value = 'Quiz assigned successfully!';
      errorMessage.value = '';
      // Animate and close modal
      setTimeout(() => {
        showModal.value = false;
      }, 500);  // Close the modal after a short delay
    } else {
      errorMessage.value = response.message || 'Failed to assign quiz. Please try again.';
    }
  } catch (error) {
    errorMessage.value = 'Error assigning quiz.';
    console.error('Error assigning quiz:', error);
  }
};
</script>

<style scoped>
/* Card hover effect */
.card {
  transition: transform 0.3s, box-shadow 0.3s;
  cursor: pointer;
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 1rem 3rem rgba(0, 0, 0, 0.175);
}

/* Assign Button Styles */
.btn.assign-btn {
  background-color: #9427ce;
  background-image: linear-gradient(to right, #9427ce, #b557e8);
  border: none;
  color: #fff;
  transition: transform 0.3s, box-shadow 0.3s;
}

.btn.assign-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 0.5rem 1.5rem rgba(148, 39, 206, 0.5);
  color: black;
}

.btn.assign-btn:active {
  transform: scale(0.95);
}

/* Modal Styles */
.modal {
  display: block;
  background-color: rgba(0, 0, 0, 0.5);
  animation: fadeIn 0.3s ease-in-out;
}

.modal-content {
  animation: slideDown 0.3s ease-in-out;
}

/* Modal Title Styles */
.modal-title-custom {
  color: #9427ce;
  text-align: center;
  font-weight: bold;
}

/* Dropdown Styles */
.rounded-dropdown {
  border-radius: 30px;
  padding: 10px;
}

/* Assign Quiz Button Styles */
.btn-assign {
  background-color: #9427ce;
  background-image: linear-gradient(to right, #9427ce, #b557e8);
  border: none;
  transition: transform 0.3s, box-shadow 0.3s;
  color: #fff;
}

.btn-assign:hover {
  transform: translateY(-3px);
  box-shadow: 0 0.5rem 1.5rem rgba(148, 39, 206, 0.5);
}

.btn-assign:active {
  transform: scale(0.95);
}

/* Modal Animations */
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideDown {
  from {
    transform: translateY(-50px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}
</style>
