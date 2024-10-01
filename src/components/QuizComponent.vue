<template>
  <div class="quiz-container mt-5">
    <header class="quiz-header">
      <h2>{{ quizName }}</h2>
      <p class="total-questions">Total Questions: {{ questions.length }}</p>
    </header>


    <!-- Error State -->
    <div v-if="errorMessage" class="alert alert-danger">
      {{ errorMessage }}
    </div>

    <!-- Quiz Question -->
    <div v-if="questions.length">
      <div class="question-box mt-3">
        <h5>{{ currentQuestionIndex + 1 }}. {{ questions[currentQuestionIndex].question }}</h5>
        <div v-for="option in questions[currentQuestionIndex].options" :key="option" class="form-check">
          <input
            class="form-check-input"
            type="radio"
            :id="option"
            :value="option"
            v-model="selectedOptions[questions[currentQuestionIndex].id]"
          />
          <label class="form-check-label" :for="option">{{ option }}</label>
        </div>
      </div>
      <div class="navigation-buttons mt-4">
        <button 
          class="btn btn-secondary" 
          v-if="currentQuestionIndex > 0" 
          @click="previousQuestion">
          Previous
        </button>
        <button 
          class="btn btn-primary" 
          @click="nextQuestion">
          {{ isLastQuestion ? 'Submit' : 'Next' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const quizId = route.params.quizId;
const questions = ref([]);
const quizName = ref('');
const loading = ref(false);
const errorMessage = ref('');
const selectedOptions = ref({});  // Object to hold selected options
const currentQuestionIndex = ref(0);  // Track the index of the current question

// Fetch quiz questions on mount
onMounted(async () => {
  loading.value = true;
  const quizData = await authStore.fetchQuizQuestions(quizId);
  
  if (quizData) {
    questions.value = quizData;
    quizName.value = authStore.quizzes.find((q) => q.quiz_id === Number(quizId)).quiz.quiz_name;
  } else {
    errorMessage.value = 'Unable to load quiz questions.';
  }

  loading.value = false;
});

const isLastQuestion = computed(() => {
  return currentQuestionIndex.value === questions.value.length - 1;
});

const nextQuestion = async () => {
  if (isLastQuestion.value) {
    await submitQuiz();  // Submit the quiz if it's the last question
  } else {
    currentQuestionIndex.value++;
  }
};


const previousQuestion = () => {
  if (currentQuestionIndex.value > 0) {
    currentQuestionIndex.value--;
  }
};

// Submit quiz function
const submitQuiz = async () => {
  const payload = {
    quiz_id: quizId,
    options: { ...selectedOptions.value },  // Copy the selected options
  };

  try {
    await authStore.submitQuizAnswers(payload);
    console.log('Submitted answers:', payload);
    // Route back to the student page after submission
    router.push('/student');
  } catch (error) {
    errorMessage.value = 'Failed to submit answers.';
    console.error('Error submitting quiz:', error);
  }
};
</script>

<style scoped>
.quiz-container {
  max-width: 600px;
  margin: auto;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #f9f9f9;
}

.quiz-header {
  text-align: center;
  background-color: #007bff;
  color: white;
  padding: 10px;
  border-radius: 5px;
}

.total-questions {
  font-size: 0.9em;
  margin-top: 5px;
}

.question-box {
  background-color: #fff;
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 5px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.form-check {
  margin: 10px 0;
}

.form-check-input {
  margin-right: 10px;
}

.navigation-buttons {
  display: flex;
  justify-content: space-between;
}

.btn {
  flex: 1;
  margin: 5px;
}

.btn-primary {
  background-color: #28a745;
  border-color: #28a745;
}

.btn-secondary {
  background-color: #6c757d;
  border-color: #6c757d;
}
</style>
