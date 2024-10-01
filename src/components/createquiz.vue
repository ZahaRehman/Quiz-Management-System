<template>
  <div class="container my-5">
    <div class="row">
      <div class="col-md-12 mb-4">
        <div class="card h-100 shadow-sm">
          <div class="card-body d-flex flex-column justify-content-between">
            <div>
              <h5 class="card-title">Create Quiz</h5>
              <p class="card-text mb-2">Click to create a new quiz.</p>
            </div>
            <router-link to="/create-quiz" class="btn create-quiz-btn">Create Quiz</router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// No changes needed here for logic
</script>

<style scoped>
.card {
  transition: transform 0.3s, box-shadow 0.3s;
  cursor: pointer;
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 1rem 3rem rgba(0, 0, 0, 0.175);
}

.create-quiz-btn {
  background-color: #9427ce;
  background-image: linear-gradient(to right, #9427ce, #b557e8);
  border: none;
  color: #fff;
  transition: transform 0.3s, box-shadow 0.3s;
}

.create-quiz-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 0.5rem 1.5rem rgba(148, 39, 206, 0.5);
}

.modal {
  display: block;
  background-color: rgba(0, 0, 0, 0.5);
  animation: fadeIn 0.3s ease-in-out;
}

.modal-content {
  animation: fadeInDown 0.3s ease-in-out;
}

.create-quiz-title {
  color: #9427ce;
  text-align: center;
  font-weight: bold;
}

.circular-input {
  border-radius: 20px;
  border: 1px solid #9427ce;
}

.question-box {
  border: 1px solid #ddd;
  border-radius: 20px;
  background-color: #fff;
  padding: 20px;
}

.finish-btn {
  background-color: #9427ce;
  background-image: linear-gradient(to right, #9427ce, #b557e8);
  border: none;
  transition: transform 0.3s, box-shadow 0.3s;
  color: #fff;
}

.finish-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 0.5rem 1.5rem rgba(148, 39, 206, 0.5);
}

.modal-backdrop {
  animation: fadeOut 0.3s ease-in-out;
}

label {
  color: #9427ce; /* Change label text color */
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes fadeInDown {
  from {
    transform: translateY(-10px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes fadeOut {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}
</style>
