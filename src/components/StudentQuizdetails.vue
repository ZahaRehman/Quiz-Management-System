<template>
  <div class="container mt-5">
    <h4 class="mb-4">View Assigned Quizzes</h4>

    <!-- Loading State -->
    <div v-if="loading" class="alert alert-info d-flex align-items-center">
      <span class="spinner-border spinner-border-sm me-2" role="status"></span>
      Loading quizzes...
    </div>

    <!-- Error State -->
    <div v-if="errorMessage" class="alert alert-danger">
      {{ errorMessage }} <button @click="fetchQuizzes" class="btn btn-link">Retry</button>
    </div>

    <!-- Success State -->
    <div v-if="successMessage" class="alert alert-success">
      {{ successMessage }}
    </div>

    <!-- Filtered Quiz Table -->
    <table v-if="pendingQuizzes.length" class="table table-striped">
      <thead>
        <tr>
          <th>Quiz Name</th>
          <th>Duration (mins)</th>
          <th>Status</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="quiz in pendingQuizzes" :key="quiz.id" class="table-row">
          <td>{{ quiz.quiz.quiz_name }}</td>
          <td>{{ quiz.quiz.duration }}</td>
          <td>
            <span class="badge bg-warning text-dark">Pending</span>
          </td>
          <td>
            <button
              @click="startQuiz(quiz.quiz_id)"
              class="btn btn-primary"
              title="Start this quiz"
            >
              Start Quiz
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- No Pending Quizzes State -->
    <div v-else>
      <p>No pending quizzes assigned.</p>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';

const router = useRouter();
const authStore = useAuthStore();
const quizAssignments = ref([]);
const loading = ref(false);
const errorMessage = ref('');
const successMessage = ref('');

// Fetch quizzes on mount
const fetchQuizzes = async () => {
  loading.value = true;
  errorMessage.value = '';
  successMessage.value = '';
  
  try {
    quizAssignments.value = await authStore.fetchAssignedQuizzes();
  } catch (error) {
    errorMessage.value = 'Failed to load quizzes. Please try again.';
  } finally {
    loading.value = false;
  }
};

// Computed property to filter pending quizzes
const pendingQuizzes = computed(() => {
  return quizAssignments.value.filter(quiz => quiz.attempt === 0);
});

// Start quiz function
const startQuiz = (quizId) => {
  router.push({ path: `/quiz/${quizId}`, params: { quizId } });
};

onMounted(fetchQuizzes);
</script>

<style scoped>
.table-row:hover {
  background-color: #f8f9fa; /* Light gray for hover effect */
}

.badge {
  font-size: 1em;
}
</style>