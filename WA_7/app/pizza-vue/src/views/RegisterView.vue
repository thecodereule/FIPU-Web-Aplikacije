<template>
  <div class="register-page">
    <div class="register-container">
      <h1>Registracija</h1>
      <form @submit.prevent="handleRegister">
        <input 
          v-model="username" 
          type="text" 
          placeholder="Korisničko ime" 
          required
        />
        <input 
          v-model="password" 
          type="password" 
          placeholder="Lozinka" 
          required
        />
        <button type="submit">Registriraj se</button>
      </form>
      <div v-if="message" :class="['message', messageType]">
        {{ message }}
      </div>
      <p class="login-link">
        Već imate račun? <router-link to="/login">Prijavite se</router-link>
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'RegisterView',
  data() {
    return {
      username: '',
      password: '',
      message: '',
      messageType: ''
    }
  },
  methods: {
    async handleRegister() {
      try {
        const response = await fetch("http://localhost:3000/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            username: this.username, 
            password: this.password 
          }),
        });

        const data = await response.json();

        if (response.ok) {
          this.messageType = 'success';
          this.message = data.message;
          this.username = '';
          this.password = '';
          
          // Preusmjeri na login nakon 2 sekunde
          setTimeout(() => {
            this.$router.push('/login');
          }, 2000);
        } else {
          this.messageType = 'error';
          this.message = data.error;
        }
      } catch (error) {
        this.messageType = 'error';
        this.message = "Greška pri povezivanju sa poslužiteljem";
      }
    }
  }
}
</script>

<style scoped>
.register-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 80vh;
  padding: 20px;
}

.register-container {
  background: white;
  padding: 40px;
  border-radius: 10px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  width: 100%;
  max-width: 400px;
}

h1 {
  text-align: center;
  color: #333;
  margin-bottom: 30px;
}

input {
  width: 100%;
  padding: 12px;
  margin: 10px 0;
  border: 1px solid #ddd;
  border-radius: 5px;
  box-sizing: border-box;
  font-size: 16px;
}

input:focus {
  outline: none;
  border-color: #667eea;
}

button {
  width: 100%;
  padding: 12px;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  margin-top: 10px;
  transition: background 0.3s;
}

button:hover {
  background: #764ba2;
}

.message {
  margin-top: 15px;
  padding: 10px;
  border-radius: 5px;
  text-align: center;
}

.success {
  background: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

.error {
  background: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}

.login-link {
  text-align: center;
  margin-top: 20px;
  color: #666;
}

.login-link a {
  color: #667eea;
  text-decoration: none;
  font-weight: 600;
}

.login-link a:hover {
  text-decoration: underline;
}
</style>