<template>
  <div class="container d-flex justify-content-center align-items-center vh-100">
    <div class="card p-4 shadow" style="border-radius: 1rem; width: 400px;">
      <div class="card-body">
        <h2 class="text-center mb-4" style="color: #9427ce;">Login</h2>
        <form @submit.prevent="handleLogin">
          <div class="form-group">
            <label for="email" class="form-label" style="color: #9427ce;">Email</label>
            <input type="email" class="form-control rounded-input" id="email" v-model="email" required>
          </div>
          <div class="form-group mt-3">
            <label for="password" class="form-label" style="color: #9427ce;">Password</label>
            <div class="input-group">
              <input type="password" class="form-control rounded-input" id="password" v-model="password" required>
            </div>
          </div>
          <div class="d-grid gap-2 mt-4">
            <button type="submit" class="btn gradient-btn btn-lg">Login</button>
          </div>
          <p v-if="errorMessage" class="text-danger mt-3" style="color: #9427ce;">{{ errorMessage }}</p>
          <div class="text-center mt-3">
            <a href="#" class="text-muted" style="color: #9427ce;">Forgot Password?</a>
          </div>
          <p class="text-center text-muted mt-4 mb-0" style="color: #9427ce;">
            Don't have an account? <a href="#" class="fw-bold text-body"><u><router-link to="/studentForm" style="color: #9427ce;">register now!</router-link></u></a>
          </p>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { useAuthStore } from '@/stores/authStore';
import { useRouter } from 'vue-router';
import { ref } from 'vue';

export default {
  setup() {
    const authStore = useAuthStore();
    const router = useRouter();
    const email = ref('');
    const password = ref('');
    const errorMessage = ref(null);

    const handleLogin = async () => {
      try {
        errorMessage.value = null;
        await authStore.login({ email: email.value, password: password.value });
        const user = authStore.getUser();

        if (user && user.role =="admin") {
          router.push('/admin');
        } 
        else if(user && user.role =="manager")
        {
          router.push('/manager');
        }
        else if(user && user.role =="student")
        {
          router.push('/student');
        }
        else {
          throw new Error('No user returned');
        }
      } catch (error) {
        errorMessage.value = 'Login failed. Please check your credentials.';
      }
    };

    return { email, password, errorMessage, handleLogin };
  },
};
</script>

<style scoped>
/* Circular border for input fields */
.rounded-input {
  border-radius: 50px;
  border: 2px solid #9427ce;
  padding: 10px;
}

/* Gradient button with circular border */
.gradient-btn {
  background: linear-gradient(45deg, #9427ce, #c47cef);
  border: none;
  border-radius: 50px;
  color: #fff;
  transition: background 0.3s ease;
}

.gradient-btn:hover {
  background: linear-gradient(45deg, #7a1aa8, #a258dc);
}

.error {
  font-size: 0.9rem;
}
</style>
