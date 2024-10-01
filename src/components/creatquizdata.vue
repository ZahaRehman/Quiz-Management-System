<template>
    <div class="container my-5 d-flex justify-content-center">
      <div class="quiz-section">
        <!-- Create Quiz Button -->
        <button @click="showModal = true" class="btn create-quiz-button mb-4 w-100">
          Create Quiz
        </button>
  
        <!-- Quiz Table -->
        <table class="table table-striped table-hover w-100">
          <thead>
            <tr>
              <th>Quiz Name</th>
              <th>Duration (minutes)</th>
              <th>Total Marks</th>
              <th>Created At</th>
              <th>Actions</th> <!-- Added Actions Column -->
            </tr>
          </thead>
          <tbody>
            <tr v-for="quiz in quizzes" :key="quiz.id">
              <td>{{ quiz.quiz_name }}</td>
              <td>{{ quiz.duration }}</td>
              <td>{{ quiz.total_marks }}</td>
              <td>{{ new Date(quiz.created_at).toLocaleString() }}</td>
              <td>
                <button @click="deleteQuiz(quiz.id)" class="btn btn-danger btn-sm">Delete</button> <!-- Delete Button -->
              </td>
            </tr>
          </tbody>
        </table>
  
        <!-- Background Overlay -->
        <div v-if="showModal" class="modal-overlay"></div>
  
        <!-- Modal for Creating Quiz -->
        <div v-if="showModal" class="modal fade show d-block" tabindex="-1" role="dialog" style="display: block;" aria-modal="true">
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title color">Create Your Quiz</h5>
                <button type="button" class="btn-close" @click="closeModal"></button>
              </div>
              <div class="modal-body">
                <form @submit.prevent="submitQuiz" class="quiz-form">
                  <div class="form-group">
                    <label for="quizName">Quiz Name:</label>
                    <input v-model="quiz.quiz_name" type="text" id="quizName" class="form-control circular-input" required />
                  </div>
  
                  <div class="row mt-3">
                    <div class="col-md-6">
                      <div class="form-group">
                        <label for="duration">Duration (in minutes):</label>
                        <input v-model="quiz.duration" type="number" id="duration" class="form-control circular-input" required />
                      </div>
                    </div>
                    <div class="col-md-6">
                      <div class="form-group">
                        <label for="totalMarks">Total Marks:</label>
                        <input
                          v-model.number="quiz.total_marks"
                          type="number"
                          id="totalMarks"
                          class="form-control circular-input"
                          required
                          @input="prepareQuestions"
                        />
                      </div>
                    </div>
                  </div>
  
                  <transition name="fade">
                    <div v-if="showQuestionBox" class="mt-5">
                      <div class="p-3 question-box mb-3">
                        <label for="question">Question:</label>
                        <input
                          v-model="currentQuestion.question"
                          type="text"
                          id="question"
                          class="form-control mb-3 circular-input"
                          placeholder="Enter your question"
                        />
  
                        <label>Options:</label>
                        <div class="row">
                          <div v-for="(opt, i) in currentQuestion.options" :key="i" class="col-md-6 mb-2">
                            <input
                              v-model="currentQuestion.options[i]"
                              type="text"
                              class="form-control circular-input"
                              placeholder="..."
                            />
                          </div>
                        </div>
  
                        <label for="correctAnswer">Correct Answer:</label>
                        <input
                          v-model="currentQuestion.correct_answer"
                          type="text"
                          id="correctAnswer"
                          class="form-control mb-3 circular-input"
                          placeholder="Correct answer"
                        />
  
                        <button type="button" class="btn finish-btn" @click="addQuestion">
                          {{ currentIndex === quiz.total_marks - 1 ? 'Finish' : 'Next' }}
                        </button>
                      </div>
                    </div>
                  </transition>
  
                  <button v-if="quiz.questions.length === quiz.total_marks" type="submit" class="btn btn-success mt-4 finish-btn">
                    Submit Quiz
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import { useAuthStore } from '@/stores/authStore';
  import axios from 'axios';
  
  const authStore = useAuthStore();
  const showModal = ref(false);
  const showQuestionBox = ref(false);
  const quizzes = ref([]);
  const quiz = ref({
    quiz_name: '',
    duration: null,
    total_marks: null,
    questions: [],
  });
  const currentIndex = ref(0);
  const currentQuestion = ref({
    question: '',
    options: ['', '', '', ''],
    correct_answer: '',
  });
  
  // Fetch quizzes on component mount
  onMounted(async () => {
    quizzes.value = await fetchQuizzes();
  });
  
  // Fetch quizzes from API
  const fetchQuizzes = async () => {
    try {
      const token = authStore.getToken();
      const response = await axios.get('http://192.168.15.44:8000/api/get-quiz', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data.data;
    } catch (error) {
      console.error('Failed to fetch quizzes:', error);
    }
  };
  
  const deleteQuiz = async (quizId) => {
    try {
      const token = authStore.getToken();
      await axios.delete(`http://192.168.15.44:8000/api/delete-quiz/${quizId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // Refresh the quiz list after deletion
      quizzes.value = await fetchQuizzes();
      alert('Quiz successfully deleted!');
    } catch (error) {
      console.error('Error deleting quiz:', error);
      alert('Failed to delete quiz. Please try again.');
    }
  };
  
  const prepareQuestions = () => {
    showQuestionBox.value = quiz.value.total_marks > 0;
  };
  
  const addQuestion = () => {
    if (currentQuestion.value.question && currentQuestion.value.correct_answer) {
      quiz.value.questions.push({ ...currentQuestion.value });
      currentQuestion.value = {
        question: '',
        options: ['', '', '', ''],
        correct_answer: '',
      };
      currentIndex.value++;
  
      if (currentIndex.value === quiz.value.total_marks) {
        showQuestionBox.value = false;
      }
    }
  };
  
  const submitQuiz = async () => {
    try {
      await authStore.createQuiz(quiz.value);
      alert('Quiz successfully created!');
      resetForm();
      closeModal();
      quizzes.value = await fetchQuizzes(); // Refresh quiz list
    } catch (error) {
      alert('Error creating quiz. Please try again.');
    }
  };
  
  const resetForm = () => {
    quiz.value = {
      quiz_name: '',
      duration: null,
      total_marks: null,
      questions: [],
    };
    currentIndex.value = 0;
    currentQuestion.value = {
      question: '',
      options: ['', '', '', ''],
      correct_answer: '',
    };
    showQuestionBox.value = false;
  };
  
  const closeModal = () => {
    showModal.value = false;
    resetForm();
  };
  </script>
  
  <style scoped>
  .container {
    display: flex;
    justify-content: center;
  }
  
  .quiz-section {
    width: 60%; /* Adjust the width of the table and button */
  }
  
  .create-quiz-button {
    background-color: #9427ce;
    color: #fff;
    border: none;
    transition: background-color 0.3s, transform 0.3s, box-shadow 0.3s;
  }
  
  .create-quiz-button:hover {
    background-color: #7b1fa2;
    transform: scale(1.05);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }
  
  .table {
    width: 100%;
    margin-top: 20px;
    text-align: center;
  }
  
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5); /* Semi-transparent background */
    z-index: 1050; /* Below modal box */
  }
  
  .modal-dialog {
    z-index: 1051; /* Ensure it's above the overlay */
  }
  
  .color {
    color: #9427ce;
  }
  
  .finish-btn {
    background-color: #9427ce;
    background-image: linear-gradient(to right, #9427ce, #b557e8);
    border: none;
    transition: transform 0.3s, box-shadow 0.3s;
    color: #fff;
  }
  
  /* Additional styles omitted for brevity */
  </style>
  