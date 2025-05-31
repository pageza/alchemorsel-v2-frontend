<template>
  <div class="user-profile">
    <h1>User Profile</h1>
    <form @submit.prevent="updateProfile">
      <div>
        <label for="username">Username:</label>
        <input type="text" id="username" v-model="profile.username" required />
      </div>
      <div>
        <label for="email">Email:</label>
        <input type="email" id="email" v-model="profile.email" required />
      </div>
      <button type="submit">Update Profile</button>
    </form>
    <button @click="handleLogout" class="logout-button">Logout</button>

    <div class="profile-history">
      <h2>Profile History</h2>
      <div v-if="history.length === 0" class="no-history">
        No history available
      </div>
      <div v-else class="history-list">
        <div v-for="entry in history" :key="entry.id" class="history-item">
          <div class="history-field">{{ entry.field }}</div>
          <div class="history-changes">
            <div class="old-value">Old: {{ entry.old_value }}</div>
            <div class="new-value">New: {{ entry.new_value }}</div>
          </div>
          <div class="history-meta">
            Changed at: {{ formatDate(entry.changed_at) }}
          </div>
        </div>
      </div>
      <div class="pagination">
        <button 
          :disabled="offset === 0" 
          @click="loadHistory(offset - limit)"
          class="pagination-button"
        >
          Previous
        </button>
        <button 
          :disabled="history.length < limit" 
          @click="loadHistory(offset + limit)"
          class="pagination-button"
        >
          Next
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

export default {
  setup() {
    const router = useRouter();
    const profile = ref({ username: '', email: '' });
    const history = ref([]);
    const limit = ref(10);
    const offset = ref(0);

    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          router.push('/login');
          return;
        }

        const response = await axios.get('/api/v1/profile', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        profile.value = response.data;
      } catch (error) {
        console.error('Error fetching profile:', error);
        if (error.response?.status === 401 || error.response?.status === 403) {
          localStorage.removeItem('token');
          router.push('/login');
        }
      }
    };

    const loadHistory = async (newOffset = 0) => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          router.push('/login');
          return;
        }

        offset.value = newOffset;
        const response = await axios.get(`/api/v1/profile/history?limit=${limit.value}&offset=${offset.value}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        history.value = response.data;
      } catch (error) {
        console.error('Error fetching profile history:', error);
        if (error.response?.status === 401 || error.response?.status === 403) {
          localStorage.removeItem('token');
          router.push('/login');
        }
      }
    };

    const updateProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          router.push('/login');
          return;
        }

        await axios.put('/api/v1/profile', profile.value, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        alert('Profile updated successfully!');
        // Reload history after update
        loadHistory(0);
      } catch (error) {
        console.error('Error updating profile:', error);
        if (error.response?.status === 401 || error.response?.status === 403) {
          localStorage.removeItem('token');
          router.push('/login');
        }
      }
    };

    const handleLogout = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          await axios.post('/api/v1/profile/logout', {}, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
        }
      } catch (error) {
        console.error('Error during logout:', error);
      } finally {
        localStorage.removeItem('token');
        router.push('/login');
      }
    };

    const formatDate = (dateString) => {
      return new Date(dateString).toLocaleString();
    };

    onMounted(() => {
      fetchProfile();
      loadHistory();
    });

    return { 
      profile, 
      updateProfile, 
      handleLogout, 
      history, 
      limit, 
      offset, 
      loadHistory,
      formatDate
    };
  },
};
</script>

<style scoped>
.user-profile {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.logout-button {
  margin-top: 20px;
  background-color: #dc3545;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
}

.logout-button:hover {
  background-color: #c82333;
}

.profile-history {
  margin-top: 40px;
  padding-top: 20px;
  border-top: 1px solid #eee;
}

.history-list {
  margin-top: 20px;
}

.history-item {
  padding: 15px;
  margin-bottom: 10px;
  border: 1px solid #eee;
  border-radius: 4px;
}

.history-field {
  font-weight: bold;
  margin-bottom: 5px;
}

.history-changes {
  display: flex;
  gap: 20px;
  margin-bottom: 5px;
}

.old-value {
  color: #dc3545;
}

.new-value {
  color: #28a745;
}

.history-meta {
  font-size: 0.9em;
  color: #666;
}

.pagination {
  margin-top: 20px;
  display: flex;
  gap: 10px;
  justify-content: center;
}

.pagination-button {
  padding: 5px 15px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: white;
  cursor: pointer;
}

.pagination-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.no-history {
  text-align: center;
  color: #666;
  padding: 20px;
}
</style> 