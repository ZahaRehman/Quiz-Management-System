<template>
  <div class="container mt-5">
    <h2>Attempted Quizzes</h2>

    <!-- Loading State -->
    <div v-if="loading" class="alert alert-info">
      Loading quizzes...
    </div>

    <!-- Error State -->
    <div v-if="errorMessage" class="alert alert-danger">
      {{ errorMessage }}
    </div>


    <!-- Quiz Table -->
    <table v-if="attemptedQuizzes.length" class="table table-striped">
      <thead>
        <tr>
          <th>Quiz Name</th>
          <th>Duration (mins)</th>
          <th>Total Marks</th>
          <th>Marks Obtained</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="quiz in attemptedQuizzes" :key="quiz.id">
          <td>{{ quiz.quiz.quiz_name }}</td>
          <td>{{ quiz.quiz.duration }}</td>
          <!-- Corrected this line: changed <table> to <td> -->
          <td>{{ quiz.quiz.total_marks }}</td>
          <td>{{ quiz.marks_obtained !== null ? quiz.marks_obtained : 'Not Graded Yet' }}</td>
        </tr>
      </tbody>
    </table>

    <!-- No Quizzes State -->
    <div v-else>
      No quizzes attempted.
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useAuthStore } from '@/stores/authStore';

const authStore = useAuthStore();
const attemptedQuizzes = ref([]);
const loading = ref(false);
const errorMessage = ref('');
const successMessage = ref('');

// Fetch quizzes on mount
onMounted(async () => {
  loading.value = true;
  errorMessage.value = '';

  // Fetch assigned quizzes
  const quizzes = await authStore.fetchAssignedQuizzes();

  // Filter out the attempted quizzes (where attempt === 1)
  attemptedQuizzes.value = quizzes.filter(quiz => quiz.attempt === 1);

  loading.value = false;
  errorMessage.value = authStore.errorMessage;
  successMessage.value = authStore.successMessage;
});
</script>

<style scoped>
.badge {
  font-size: 1em;
}
</style>
