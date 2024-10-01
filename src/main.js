import { createApp } from 'vue';
import App from './App.vue';
import router from './router'; // Make sure this import is correct
import { createPinia } from 'pinia';
import 'bootstrap/dist/css/bootstrap.min.css';

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(router); // Ensure the router is being used
app.mount('#app');
