<template>
    <section class="vh-50 bg-image">
      <div class="mask d-flex align-items-center h-100 gradient-custom-3">
        <div class="container h-100 c1">
          <div class="row d-flex justify-content-center align-items-center h-50">
            <div class="col-12 col-md-9 col-lg-7 col-xl-6">
              <div class="card" style="border-radius: 15px;">
                <div class="card-body p-4">
                  <h2 class="text-uppercase text-start mb-5">Testify</h2>
                  <h4 class="text-uppercase text-start mb-5">build a better community! </h4>
                  <form @submit.prevent="submitForm">
                    <div class="form-outline mb-4">
                      <input type="text" id="form3Example1cg" class="form-control form-control-lg" v-model="name"
                        required />
                      <label class="form-label" for="form3Example1cg">Your Name</label>
                    </div>

                    <div class="form-outline mb-4">
                      <input type="email" id="form3Example3cg" class="form-control form-control-lg" v-model="email"
                        required />
                      <label class="form-label" for="form3Example3cg">Your Email</label>
                    </div>

                    <div class="form-outline mb-4">
                      <input type="password" id="form3Example4cg" class="form-control form-control-lg"
                        v-model="password" required />
                      <label class="form-label" for="form3Example4cg">Password</label>
                    </div>

                    <div class="d-flex justify-content-center">
                      <button type="submit" data-mdb-button-init data-mdb-ripple-init
                        class="btn btn-success btn-block btn-lg gradient-custom-4 text-body">Login</button>
                    </div>

                    <p class="text-center text-muted mt-5 mb-0">Have already an account? <a href="#!"
                        class="fw-bold text-body"><u><RouterLink to="/about">Register</RouterLink></u></a></p>
                        
                  </form>

                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </section>
</template>

<script>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

export default {
  name: 'SignupForm',
  setup() {
    const name = ref('');
    const email = ref('');
    const password = ref('');
    const confirmPassword = ref('');
    const agreeToTerms = ref(false);
    const router = useRouter();

    const submitForm = () => {
      if (password.value !== confirmPassword.value) {
        alert('Passwords do not match');
        return;
      }

      // Create user object
      const newUser = {
        name: name.value,
        email: email.value,
        password: password.value,
      };

      // Simulate saving user data
      console.log('User registered:', newUser);

      // Reset form fields
      name.value = '';
      email.value = '';
      password.value = '';
      

      alert('Signup successful!');
      router.push('/ProfilePage'); // Redirect to another route
    };

    return {
      name,
      email,
      password,
      confirmPassword,
      agreeToTerms,
      submitForm
    };
  }
};
</script>

<style >

.gradient-custom-3 {

  /* background: #84fab0; */
  /* height: 10vh; */
  /* width: 100vw; */
  background: linear-gradient(to right, rgba(132, 250, 176, 0.5), rgba(143, 211, 244, 0.5));    
  padding: 20px 0;
  
  /* background: -webkit-linear-gradient(to right, rgba(132, 250, 176, 0.5), rgba(143, 211, 244, 0.5)); */

}
.gradient-custom-4 {
  background: #84fab0;

  background: -webkit-linear-gradient(to right, rgba(132, 250, 176, 1), rgba(143, 211, 244, 1));

  background: linear-gradient(to right, rgba(132, 250, 176, 1), rgba(143, 211, 244, 1));
}
</style>