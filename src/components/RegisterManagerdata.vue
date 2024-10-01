<template>
    <div class="container mt-4">
        <!-- Create User Button -->
        <button @click="showModal = true" class="btn register-manager-button mb-3 small-button">
            Register New Users
        </button>

        <!-- Role Filter -->
        <div class="mb-3">
            <label for="roleFilter" class="form-label">Filter by Role</label>
            <select
                class="form-select"
                id="roleFilter"
                v-model="selectedRole"
                @change="fetchUsersByRole"
            >
                <option value="" disabled>Select Role</option>
                <option value="manager">Manager</option>
                <option value="supervisor">Supervisor</option>
                <option value="admin">Admin</option>
            </select>
        </div>

        <!-- Users Table -->
        <div class="table-responsive">
            <table class="table table-striped table-hover">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="user in users" :key="user.id">
                        <td>{{ user.name }}</td>
                        <td>{{ user.email }}</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- Background Overlay -->
        <div v-if="showModal" class="modal-overlay"></div>

        <div v-if="showModal" class="modal fade show" tabindex="-1" aria-modal="true" role="dialog">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title text-assign-user">Register User</h5>
                        <button type="button" class="btn-close" aria-label="Close" @click="closeModal"></button>
                    </div>
                    <div class="modal-body">
                        <form @submit.prevent="registerManager">
                            <div class="mb-3">
                                <label for="name" class="form-label text-purple">Name</label>
                                <input type="text" class="form-control input-rounded" id="name" v-model="name" required />
                            </div>
                            <div class="mb-3">
                                <label for="email" class="form-label text-purple">Email</label>
                                <input type="email" class="form-control input-rounded" id="email" v-model="email" required />
                            </div>
                            <div class="mb-3">
                                <label for="role" class="form-label text-purple">Role</label>
                                <select class="form-select input-rounded" id="role" v-model="role" required>
                                    <option value="" disabled>Select Role</option>
                                    <option value="manager">Manager</option>
                                    <option value="supervisor">Supervisor</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </div>
                            <button type="submit" class="btn btn-register-user w-100">Register User</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
        <div v-if="showModal" class="modal-backdrop fade show"></div>
    </div>
</template>

<script>
import { useAuthStore } from '@/stores/authStore';
import { ref, onMounted } from 'vue';

export default {
    setup() {
        const authStore = useAuthStore();
        const name = ref('');
        const email = ref('');
        const role = ref('');
        const selectedRole = ref('');
        const showModal = ref(false);
        const users = ref([]);

        const fetchUsersByRole = async () => {
            try {
                users.value = await authStore.fetchUsersByRole(selectedRole.value);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        onMounted(fetchUsersByRole);

        const registerManager = async () => {
            try {
                await authStore.registerManager({
                    name: name.value,
                    email: email.value,
                    role: role.value,
                });
                showModal.value = false;
                name.value = '';
                email.value = '';
                role.value = '';
                fetchUsersByRole();
                closeModal();
            } catch (error) {
                console.error('Error registering manager:', error);
            }
        };

        const closeModal = () => {
            showModal.value = false;
        };

        return {
            name,
            email,
            role,
            selectedRole,
            showModal,
            users,
            registerManager,
            closeModal,
            fetchUsersByRole,
        };
    },
};
</script>

<style scoped>
.container {
    max-width: 800px;
    margin: auto;
}

.btn {
    width: 100%;
}

.table-responsive {
    margin-bottom: 20px;
}

/* Modal Styles */
.modal {
    display: block;
    background-color: rgba(0, 0, 0, 0.5);
}

.text-assign-user {
    color: #9427ce;
}

/* Register New Users Button Styles */
.register-manager-button {
    background-color: #9427ce;
    color: #fff;
    border: none;
    transition: background-color 0.3s, transform 0.3s, box-shadow 0.3s;
    font-size: 0.9rem; /* Reduced font size */
    padding: 0.5rem 1rem; /* Adjust padding for smaller size */
}

.register-manager-button:hover {
    background-color: #7b1fa2;
    transform: scale(1.05);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

/* Register User Button Styles */
.btn-register-user {
    background-color: #9427ce;
    color: #fff;
    transition: transform 0.3s, box-shadow 0.3s;
}

.btn-register-user:hover {
    background-color: #7b1fa2;
}

/* Rounded Input Fields */
.input-rounded {
    border-radius: 50px;
}

/* Label Color */
.text-purple {
    color: #9427ce;
}
</style>