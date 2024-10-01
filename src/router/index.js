import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';

// Import views
import AdminView from '@/views/AdminView.vue';
import ManagerView from '@/views/ManagerView.vue';
import StudentView from '@/views/StudentView.vue';
import LoginView from '@/views/LoginView.vue';
import StudentInfo from '@/components/StudentInfo.vue';
import createquiz from '@/components/createquiz.vue';
import QuizComponent from '@/components/QuizComponent.vue';
import SetPassword from '@/components/SetPassword.vue';
import creatquizdata from '@/components/creatquizdata.vue';
import RegisterManagerdata from '@/components/RegisterManagerdata.vue';
import AdminStudentResultdata from '@/components/AdminStudentResultdata.vue';
const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: LoginView },
  {
    path: '/admin',
    component: AdminView,

  },
  {
    path: '/manager',
    component: ManagerView,
  },
  {
    path: '/student',
    component: StudentView,
  },
  {
    path: '/studentForm',
    component: StudentInfo
  },
  {
    path : '/CreatQuiz',
    component: createquiz,
  },
  {
    path: '/quiz/:quizId',
    name: 'QuizComponent',
    component: QuizComponent,
    props: true, // Pass route params as props
  },
  {
    path: '/SetPassword',
    component: SetPassword
  },
  {
    path: '/create-quiz',
    name: 'CreateQuiz',
    component: creatquizdata,
  },
  {
    path: '/RegisterManagerdata',
    name: 'RegisterManagerdata',
    component: RegisterManagerdata,
  },
  {
    path: '/AdminStudentResultdata',
    name: 'AdminStudentResultdata',
    component: AdminStudentResultdata
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Navigation guard
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  const token = authStore.getToken();
  const user = authStore.getUser();

  if (to.meta.requiresAuth && !token) {
    next('/login');
  } else if (to.meta.requiresAuth && to.meta.role !== user?.role) {
    next('/login');
  } else {
    next();
  }
});

export default router;
