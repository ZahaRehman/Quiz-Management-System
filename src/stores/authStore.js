import { defineStore } from 'pinia';
import axios from 'axios';

export const useAuthStore = defineStore('authStore', {
  state: () => ({
    token: null,
    user: null,
    applicationData: [],
    acceptedStudents: [],
   // quizzes: [],

    quizzes: [], // To store quiz data
    loading: false,
    errorMessage: '',
    successMessage: '',
    approvedStudents: [],
    rejectedStudents: [],




    loading: false,
    successMessage: '',
    errorMessage: '',
  }),
  actions: {
    async fetchUsersByRole(role) {
      this.loading = true;
      this.errorMessage = '';
      this.users = [];
      try {
        const response = await axios.get(`http://192.168.15.44:8000/api/get-users-by-role?role=${role}`, {
          headers: {
            'Authorization': `Bearer ${this.getToken()}`,
          }
        });
    
        this.users = response.data.data.data;  // Access the users array within the response
        this.successMessage = response.data.message;
        return this.users;
      } catch (error) {
        this.errorMessage = error.response?.data?.message || 'Failed to fetch users.';
        console.error('Error fetching users by role:', error);
      } finally {
        this.loading = false;
      }
    }
    ,
    async fetchAssignedQuizzes() {
      this.loading = true;
      this.errorMessage = '';
      try {
        const response = await axios.get('http://192.168.15.44:8000/api/get/student-assigned/quiz', {
          headers: {
            'Authorization': `Bearer ${this.getToken()}`,
          }
        });
        return response.data.data

        
      } catch (error) {
        this.errorMessage = error.response?.data?.message || 'Failed to fetch assigned quizzes.';
        console.error('Error fetching quizzes:', error);
      } finally {
        this.loading = false;
      }
    },
    async fetchQuizQuestions(quizId) {
      this.loading = true;
      this.errorMessage = '';
      this.successMessage = '';
      
      try {
        const response = await axios.get(`http://192.168.15.44:8000/api/get/quiz/questions/${quizId}`, {
          headers: {
            'Authorization': `Bearer ${this.token || localStorage.getItem('token')}`,
          },
        });

        return response.data.data;  // Store the fetched questions

      } catch (error) {
        this.errorMessage = error.response?.data?.message || 'Failed to fetch quiz questions.';
        console.error('Fetch Quiz Questions Error:', error);
      } finally {
        this.loading = false;
      }
    }
    ,
    async submitQuizAnswers(payload) {
      this.loading = true;
      this.errorMessage = '';
      this.successMessage = '';

      try {
        const response = await axios.post(`http://192.168.15.44:8000/api/submit/quiz/options`, payload, {
          headers: {
            'Authorization': `Bearer ${this.token || localStorage.getItem('token')}`,
          },
        });
        console.log("quiz submission",response);

        this.successMessage = 'Quiz submitted successfully!';
      } catch (error) {
        this.errorMessage = error.response?.data?.message || 'Failed to submit quiz.';
        console.error('Submit Quiz Error:', error);
      } finally {
        this.loading = false;
      }
    }
    ,


    async submitApplication(formData) {
      this.loading = true;
      this.successMessage = '';
      this.errorMessage = '';
      try {
        const response = await axios.post('http://192.168.15.44:8000/api/submit', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        this.successMessage = 'Application submitted successfully!';
        return response.data;
      } catch (error) {
        this.errorMessage = error.response?.data?.message || 'An error occurred while submitting the application.';
        console.error('Submission Error:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },
    
    async login(credentials) {
      try {
        const response = await axios.post('http://192.168.15.44:8000/api/login', {
          email: credentials.email,
          password: credentials.password,
        });
    
        const data = response.data.data;  // Access the data object containing token and role
        const token = data.access_token;  // JWT token
    
        if (data && token) {
          this.token = token;
          this.user = {
            role: data.role,  // Save the role in the user object
            permissions: data.permissions,  // Save the permissions
          };
    
          // Store token and user data in localStorage
          localStorage.setItem('token', this.token);
          localStorage.setItem('user', JSON.stringify(this.user));
    
          // Set the Authorization header with the token
          axios.defaults.headers.common['Authorization'] = `Bearer ${this.token}`;
        } else {
          throw new Error('Invalid login response');
        }
      } catch (error) {
        console.error('Login failed:', error);
        this.errorMessage = 'Invalid credentials';
        throw new Error('Invalid credentials');
      }
    }
    ,
    
    logout() {
      this.token = null;
      this.user = null;
      this.applicationData = []; // Clear application data on logout
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },
    async fetchApplications() {
      try {
        const token = this.getToken();
        const response = await axios.get('http://192.168.15.44:8000/api/get-submissions', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        this.applicationData = response.data.data;

        
      } catch (error) {
        console.error('Failed to fetch applications:', error);
        throw new Error('Failed to fetch applications');
      }
    },
    getApplicationData() {
      return this.applicationData;
    },


    async approveApplication(applicationId) {
      try {
        const token = this.getToken();
        await axios.post('http://192.168.15.44:8000/api/accept/submissions', { id: applicationId }, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        // Update the application status or fetch the updated list
        await this.fetchApplications();
      } catch (error) {
        console.error('Error approving application:', error);
        throw new Error('Failed to approve application');
      }
    },
    
    async rejectApplication(applicationId) {
      try {
        const token = this.getToken();
        await axios.post('http://192.168.15.44:8000/api/reject/submissions', { id: applicationId }, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        // Update the application status or fetch the updated list
        await this.fetchApplications();
      } catch (error) {
        console.error('Error rejecting application:', error);
        throw new Error('Failed to reject application');
      }
    },
    async fetchApplications(status = 'all') {
      try {
        const token = this.getToken();
        let url = 'http://192.168.15.44:8000/api/get-submissions';
        if (status !== 'all') {
          url = `http://192.168.15.44:8000/api/${status}-submissions`;
        }
        const response = await axios.get(url, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        this.applicationData = response.data.data;
      } catch (error) {
        console.error('Failed to fetch applications:', error);
        throw new Error('Failed to fetch applications');
      }
    }
    ,
    async registerManager(managerData) {
      try {
        const token = this.getToken();
        await axios.post('http://192.168.15.44:8000/api/register/user', managerData, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        // Optionally, you can fetch the updated list of managers after registration
      } catch (error) {
        console.error('Error registering manager:', error);
        throw new Error('Failed to register manager');
      }
    }
    ,
    async setPassword(data) {
      try {
        const response = await axios.post('http://192.168.15.44:8000/api/user/set-password', data);
        console.log("fazal hit", response);
        return response.data;
      } catch (error) {
        console.error('Error setting password:', error);
        throw new Error('Failed to set password');
      }
    }
    ,
    async createQuiz(quizData) {
      try {
        
        const token = this.getToken();
        const response = await axios.post('http://192.168.15.44:8000/api/create/quiz', quizData, {
          headers: {
            'Authorization': `Bearer ${token}`, // Include token if needed
            'Content-Type': 'application/json',
          },
        });
        console.log("create quiz ",response);
        return response.data; // Return response for further use if needed
      } catch (error) {
        console.error('Error creating quiz:', error);
        throw error; // Handle error in the component if needed
      }
    }
    ,

    async fetchStudents() {
      try {
        const token = this.getToken();
        const response = await axios.get('http://192.168.15.44:8000/api/get-students', {
          headers: {
            Authorization: `Bearer ${token}`, // Include token here
          },
        });
        // Access the nested student data
        return response.data.data; // Store fetched students
      } catch (error) {
        console.error('Failed to fetch students:', error);
      }
    },
    async fetchQuizes() {
      try {
        const token = this.getToken();
        const response = await axios.get('http://192.168.15.44:8000/api/get-quiz', {
          headers: {
            Authorization: `Bearer ${token}`, // Include token here
          },
        });
        console.log("quiz data",response);
        // Access the nested student data
        return response.data; // Store fetched students
      } catch (error) {
        console.error('Failed to fetch students:', error);
      }
    },
    
    async assignQuizapi(payload) {
      try {    
          const token = localStorage.getItem('token');
          if (!token) {
              throw new Error('No authentication token found.');
          }
          const response = await axios.post('http://192.168.15.44:8000/api/assign/quizzes', payload, {
              headers: {
                  Authorization: `Bearer ${token}`,
              },
          });
          return response.data;
      } catch (error) {
          console.error('Error assigning quiz:', error);
          throw error; // Re-throw the error for handling in the calling function
      }
    } 
    ,
    async getUserAssignedQuizByUserIdApi(user_id) {
      try {
  
          // Retrieve the authentication token from local storage
          const token = localStorage.getItem('token');
            if (!token) {
  
              throw new Error('No authentication token found.');
          }
          // Construct the API URL with the userId parameter
  
          const response = await axios.get(`http://192.168.15.44:8000/api/get/student-assigned/quiz?user_id=${user_id}`, {
  
              headers: {
  
                  Authorization: `Bearer ${token}`,
  
              },
  
          });
          console.log(response);
  
          return response.data.data;
  
      } catch (error) {
  
          console.error('Error fetching assigned quizzes for user:', error);
  
          throw error;  
      }
    }
    ,
   













    // Login and other actions...

    getApprovedStudents() {
      return this.approvedStudents;
    },
    
    getRejectedStudents() {
      return this.rejectedStudents;
    },

    getUser() {
      return this.user;
    },
    getToken() {
      return this.token || localStorage.getItem('token');
    },
    getUser() {
      if (!this.user) {
        this.user = JSON.parse(localStorage.getItem('user'));
      }
      return this.user;
    }
  }
});
