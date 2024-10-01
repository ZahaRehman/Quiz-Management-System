<template>
    <div class="container mt-5 col-lg-9">
      <h3 class="text-center mb-4">Filter Students by Status</h3>

      <!-- Custom Styled Dropdown -->
      <div class="custom-dropdown mb-4">
        <label for="studentStatus" class="form-label">Select Student Status</label>
        <div class="dropdown-container">
          <select v-model="selectedStatus" id="studentStatus" class="custom-select">
            <option value="approved">Approved Students</option>
            <option value="rejected">Rejected Students</option>
          </select>
          <div class="dropdown-arrow"></div>
        </div>
      </div>
  
      <!-- Display Filtered Students in Cards -->
      <div v-if="filteredStudents.length">
        <h4 class="mb-3">{{ selectedStatus  }}:</h4>
  
        <div class="row">
          <div
            v-for="student in filteredStudents"
            :key="student.id"
            class="col-lg-4 col-md-6 mb-4 d-flex align-items-stretch"
          >
            <div class="card  col-lg-12 student-card shadow-sm">
              <div class="card-body">
                <h5 class="card-title">{{ student.email }}</h5>
                <p class="card-text">
                  <strong>Role:</strong> {{ student.role }}<br>
                  <strong>Job Role:</strong> {{ student.jobRole || 'N/A' }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
  
      <p v-else>No students found for the selected status.</p>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, onMounted } from 'vue';
  import { useAuthStore } from '@/stores/authStore';
  
  // Setup store and reactive variables
  const authStore = useAuthStore();
  const selectedStatus = ref('approved');  // Default filter is "approved"
  
  onMounted(async () => {
    try {
      // Fetch both approved and rejected students when the component is mounted
      await authStore.fetchApprovedStudents();
      await authStore.fetchRejectedStudents();
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  });
  
  // Computed property to filter students based on the selected status
  const filteredStudents = computed(() => {
    if (selectedStatus.value === 'approved') {
      return authStore.getApprovedStudents();
    } else if (selectedStatus.value === 'rejected') {
      return authStore.getRejectedStudents();
    }
    return [];
  });
  </script>
  
  <style scoped>
  /* Custom Dropdown Styling */
  .custom-dropdown {
    position: relative;
    display: inline-block;
    width: 100%;
  }
  
  .dropdown-container {
    position: relative;
    display: flex;
    align-items: center;
  }
  
  .custom-select {
    appearance: none;
    width: 100%;
    padding: 10px 15px;
    font-size: 16px;
    border: 2px solid #007bff;
    border-radius: 8px;
    background-color: #fff;
    color: #333;
    cursor: pointer;
    transition: border-color 0.3s, box-shadow 0.3s;
  }
  
  .custom-select:focus {
    outline: none;
    border-color: #0056b3;
    box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
  }
  
  /* Custom Arrow Styling */
  .dropdown-arrow {
    position: absolute;
    right: 15px;
    top: 50%;
    transform: translateY(-50%);
    pointer-events: none;
    width: 12px;
    height: 12px;
    border-right: 2px solid #007bff;
    border-bottom: 2px solid #007bff;
    transform: rotate(45deg) translateY(-50%);
    transition: transform 0.2s ease;
  }
  
  .custom-select:focus + .dropdown-arrow {
    transform: rotate(-135deg) translateY(-50%);
  }
  
  /* Dropdown Items Styling */
  .custom-select option {
    padding: 10px;
    font-size: 16px;
  }
  
  .custom-select option:hover {
    background-color: #f0f8ff;
    
  }
  
  /* Card layout for students */
  .student-card {
    border-radius: 10px;
    overflow: hidden;
    transition: transform 0.3s, box-shadow 0.3s;
    background-color: #fff;
    border: 1px solid #e0e0e0;
  }
  
  .student-card .card-body {
    padding: 10px;
  }
  
  .student-card .card-title {
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 10px;
  }
  
  .student-card .card-text {
    font-size: 14px;
    color: #555;
    line-height: 1.6;
  }
  
  .student-card:hover {
    transform: translateY(-10px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  }
  
  .row {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
  }
  
  .d-flex {
    display: flex;
  }
  
  .align-items-stretch {
    align-items: stretch;
  }
  
  @media (max-width: 768px) {
    .col-lg-4, .col-md-6 {
      flex: 0 0 100%;
      max-width: 100%;
    }
  }
  
  @media (min-width: 769px) and (max-width: 992px) {
    .col-lg-4, .col-md-6 {
      flex: 0 0 50%;
      max-width: 50%;
    }
  }
  
  @media (min-width: 993px) {
    .col-lg-4 {
      flex: 0 0 33.3333%;
      max-width: 33.3333%;
    }
  }
  </style>
  
  <!-- Capitalize filter for the dropdown labels -->
  <script>
  export default {
    filters: {
      capitalize(value) {
        if (!value) return '';
        value = value.toString();
        return value.charAt(0).toUpperCase() + value.slice(1);
      }
    }
  }
  </script>