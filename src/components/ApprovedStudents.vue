<template>
  <div class="container my-2">
    <div class="row mb-4">
      <div class="col-md-4 col-sm-6">
        <div class="form-group">
          <label for="filter-status" class="form-label">Filter by Status:</label>
          <select
            id="filter-status"
            v-model="selectedStatus"
            class="form-control"
            @change="fetchApplications"
          >
            <option value="all">All</option>
            <option value="accepted">Accepted</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>
    </div>
    <div class="table-responsive">
      <table class="table table-striped table-hover">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th class="cv-cell">CV</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="application in filteredApplications" :key="application.id">
            <td>{{ application.name }}</td>
            <td>{{ application.email }}</td>
            <td class="cv-cell"> 
              <a :href="application.cv_url" target="_blank" class="btn btn-outline-primary btn-sm">
                View CV
              </a>
            </td>
            <td :class="getStatusClass(application.status)">
              {{ application.status }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import { useAuthStore } from '@/stores/authStore';
import { ref, computed, onMounted } from 'vue';

export default {
  setup() {
    const authStore = useAuthStore();
    const selectedStatus = ref('all');
    const applications = ref([]);

    const fetchApplications = async () => {
      try {
        await authStore.fetchApplications(selectedStatus.value);
        applications.value = authStore.getApplicationData();
      } catch (error) {
        console.error('Error fetching applications:', error);
      }
    };

    const filteredApplications = computed(() => {
      if (selectedStatus.value === 'all') {
        return applications.value;
      } else {
        return applications.value.filter(app => app.status.toLowerCase() === selectedStatus.value);
      }
    });

    const getStatusClass = (status) => {
      switch (status.toLowerCase()) {
        case 'accepted':
          return 'text-success'; // Green text for accepted
        case 'pending':
          return 'text-warning'; // Yellow text for pending
        case 'rejected':
          return 'text-danger'; // Red text for rejected
        default:
          return '';
      }
    };

    onMounted(fetchApplications);

    return { selectedStatus, filteredApplications, fetchApplications, getStatusClass };
  },
};
</script>

<style scoped>
.table {
  font-size: 0.9rem;
}

.btn {
  font-size: 0.8rem;
}

/* Shift CV column to the left */
.cv-cell {
  padding-right: 100px; /* Adjust padding to shift left */
}

/* Custom classes for status colors */
.text-success {
  color: green; /* Green color for accepted */
}

.text-warning {
  color: orange; /* Orange color for pending */
}

.text-danger {
  color: red; /* Red color for rejected */
}

@media (max-width: 767.98px) {
  .table {
    font-size: 0.8rem;
  }

  .btn {
    font-size: 0.7rem;
  }
}
</style>
