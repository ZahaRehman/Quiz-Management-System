<template>
  <div class="d-flex justify-content-center align-items-center vh-100 bg-light">
    <div class="card p-4 custom-card" style="width: 400px;">
      <h3 class="mb-4 text-center title-text">Student Application</h3>
      <form @submit.prevent="handleSubmit">
        <!-- Full Name -->
        <div class="row mb-3">
          <div class="col-lg-12">
            <label for="fullName" class="form-label label-text">Full Name</label>
            <input v-model="fullName" type="text" id="fullName" class="form-control rounded-input" placeholder="Enter Full Name" required />
          </div>
        </div>

        <!-- Email -->
        <div class="row mb-3">
          <div class="col-lg-12">
            <label for="email" class="form-label label-text">Email</label>
            <input v-model="email" type="email" id="email" class="form-control rounded-input" placeholder="Enter Email" required />
          </div>
        </div>

        <!-- CV Upload -->
        <div class="row mb-3">
          <div class="col-lg-12">
            <label for="cvUpload" class="form-label label-text">Upload Your CV</label>
            <input @change="handleFileUpload" type="file" id="cvUpload" class="form-control rounded-input" accept=".pdf,.doc,.docx" required />
          </div>
        </div>

        <!-- Submit Button -->
        <div class="d-grid">
          <button type="submit" class="btn btn-submit btn-block rounded-input" :disabled="loading">
            {{ loading ? 'Submitting...' : 'Apply Now' }}
          </button>
        </div>

        <!-- Success or Error Messages -->
        <div v-if="successMessage" class="alert alert-success mt-3">{{ successMessage }}</div>
        <div v-if="errorMessage" class="alert alert-danger mt-3">{{ errorMessage }}</div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useAuthStore } from '@/stores/authStore';
import { useRouter } from 'vue-router';

const fullName = ref('');
const email = ref('');
const resumeFile = ref(null);

const authStore = useAuthStore();
const loading = ref(false);
const successMessage = ref('');
const errorMessage = ref('');
const router = useRouter(); // Use Vue Router for navigation

// Handle file upload
const handleFileUpload = (event) => {
  resumeFile.value = event.target.files[0]; // Store the file
};

// Handle form submission
const handleSubmit = async () => {
  if (!resumeFile.value) {
    errorMessage.value = 'Please upload your CV.';
    return;
  }

  const formData = new FormData();
  formData.append('name', fullName.value); // Append name
  formData.append('email', email.value);   // Append email
  formData.append('cv', resumeFile.value); // Append the file

  try {
    loading.value = true;
    successMessage.value = '';
    errorMessage.value = '';

    await authStore.submitApplication(formData); // Submit the form data
    successMessage.value = authStore.successMessage;

    // Navigate to login page after successful submission
    if (successMessage.value) {
      router.push('/login');
    }
  } catch (error) {
    errorMessage.value = authStore.errorMessage || 'Failed to submit application.';
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.title-text {
  color: #9427ce; /* Title text color */
}

.label-text {
  color: #9427ce; /* Label text color */
}

.rounded-input {
  border-radius: 50px; /* Circular borders for input fields */
}

.btn-submit {
  background-color: #9427ce; /* Background color for Apply Now button */
  color: white; /* Text color for Apply Now button */
  border-radius: 50px; /* Circular borders for Apply Now button */
  transition: background-color 0.3s ease, transform 0.2s; /* Smooth transition for button */
}

.btn-submit:hover {
  background-color: #7a1f99; /* Darker shade on hover */
}

.btn-submit:active {
  transform: scale(0.95); /* Scale down on click for animation */
}

/* Card styling */
.custom-card {
  border-radius: 15px; /* Rounded corners for the card */
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2); /* Box shadow for card */
}

/* Success and error messages styling */
.alert {
  transition: opacity 0.5s ease; /* Smooth transition for messages */
}
</style>
