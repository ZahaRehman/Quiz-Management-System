<template>
  <div class="container">
    <h3 class="mb-4">Student Applications</h3>
    <div class="table-responsive">
      <table class="table table-striped table-hover">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>CV</th>
            <th class="d-flex justify-content-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="application in pendingApplications" :key="application.id">
            <td>{{ application.name }}</td>
            <td>{{ application.email }}</td>
            <td>
              <a :href="application.cv_url" target="_blank" class="btn btn-outline-primary btn-sm">
                View CV
              </a>
            </td>
            <td>
              <div class="d-flex justify-content-center">
                <button class="btn btn-primary btn-sm me-2" @click="approveApplication(application.id)">
                  Approve
                </button>
                <button class="btn btn-danger btn-sm" @click="rejectApplication(application.id)">
                  Reject
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import { useAuthStore } from '@/stores/authStore';
import { onMounted, computed } from 'vue';

export default {
  setup() {
    const authStore = useAuthStore();

    const fetchApplications = async () => {
      try {
        await authStore.fetchApplications();
      } catch (error) {
        console.error('Error fetching applications:', error);
      }
    };

    const pendingApplications = computed(() => {
      return authStore.getApplicationData().filter(app => app.status === 'Pending');
    });

    const approveApplication = async (applicationId) => {
      try {
        await authStore.approveApplication(applicationId);
      } catch (error) {
        console.error('Error approving application:', error);
      }
    };

    const rejectApplication = async (applicationId) => {
      try {
        await authStore.rejectApplication(applicationId);
      } catch (error) {
        console.error('Error rejecting application:', error);
      }
    };

    onMounted(fetchApplications);

    return { pendingApplications, approveApplication, rejectApplication };
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

@media (max-width: 767.98px) {
  .table {
    font-size: 0.8rem;
  }

  .btn {
    font-size: 0.7rem;
  }
}
</style>