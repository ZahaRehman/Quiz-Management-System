<template>
    <div class="container my-5">
      <div class="row justify-content-center">
        <div class="col-md-6">
          <div class="card shadow-sm">
            <div class="card-body">
              <h5 class="card-title">Set Password</h5>
              <form @submit.prevent="setPassword">
                <div class="mb-3">
                  <label for="token" class="form-label">Token</label>
                  <input type="text" class="form-control" id="token" v-model="token" required />
                </div>
                <div class="mb-3">
                  <label for="email" class="form-label">Email</label>
                  <input type="email" class="form-control" id="email" v-model="email" required />
                </div>
                <div class="mb-3">
                  <label for="password" class="form-label">Password</label>
                  <input type="password" class="form-control" id="password" v-model="password" required />
                </div>
                <div class="mb-3">
                  <label for="password_confirmation" class="form-label">Confirm Password</label>
                  <input type="password" class="form-control" id="password_confirmation" v-model="password_confirmation" required />
                </div>
                <div class="text-danger" v-if="passwordsDontMatch">Passwords do not match.</div>
                <button type="submit" class="btn btn-primary">Set Password</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { useAuthStore } from '@/stores/authStore';
  import { ref, computed } from 'vue';
  
  export default {
    setup() {
      const authStore = useAuthStore();
      const token = ref('');
      const email = ref('');
      const password = ref('');
      const password_confirmation = ref('');
      const passwordsDontMatch = computed(() => password.value !== password_confirmation.value);
  
      const setPassword = async () => {
        try {
          await authStore.setPassword({
            token: token.value,
            email: email.value,
            password: password.value,
            password_confirmation: password_confirmation.value,
          });
          token.value = '';
          email.value = '';
          password.value = '';
          password_confirmation.value = '';
        } catch (error) {
          console.error('Error setting password:', error);
        }
      };
  
      return {
        token,
        email,
        password,
        password_confirmation,
        passwordsDontMatch,
        setPassword,
      };
    },
  };
  </script>
  
  <style scoped>
  /* Same CSS as before */
  </style>