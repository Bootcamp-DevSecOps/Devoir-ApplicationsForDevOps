<template>
  <div class="container">
    <h1>📇 Carnet de Contacts</h1>
    <p>{{ status }}</p>
    <form @submit.prevent="addContact">
      <input v-model="name" placeholder="Nom" required />
      <input v-model="phone" placeholder="Téléphone" />
      <input v-model="email" placeholder="Email" />
      <button type="submit">Ajouter</button>
    </form>
    <ul>
      <li v-for="c in contacts" :key="c.id">
        <strong>{{ c.name }}</strong>
        <span v-if="c.phone"> — {{ c.phone }}</span>
        <span v-if="c.email"> — {{ c.email }}</span>
        <button @click="deleteContact(c.id)">🗑️</button>
      </li>
    </ul>
  </div>
</template>

<script>
const API_URL = 'http://localhost:5000/api';

export default {
  data() {
    return {
      contacts: [],
      name: '',
      phone: '',
      email: '',
      status: 'Connexion au backend...'
    };
  },
  mounted() {
    // Vérification de la communication frontend <-> backend
    fetch(`${API_URL}/health`)
      .then((res) => res.json())
      .then((data) => {
        this.status = `✅ ${data.message}`;
      })
      .catch(() => {
        this.status = "❌ Backend inaccessible. Vérifiez qu'il est démarré sur le port 5000.";
      });
    this.fetchContacts();
  },
  methods: {
    fetchContacts() {
      fetch(`${API_URL}/contacts`)
        .then((res) => res.json())
        .then((data) => {
          this.contacts = data;
        });
    },
    addContact() {
      fetch(`${API_URL}/contacts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: this.name, phone: this.phone, email: this.email })
      })
        .then((res) => res.json())
        .then(() => {
          this.name = '';
          this.phone = '';
          this.email = '';
          this.fetchContacts();
        });
    },
    deleteContact(id) {
      fetch(`${API_URL}/contacts/${id}`, { method: 'DELETE' }).then(this.fetchContacts);
    }
  }
};
</script>

<style scoped>
.container {
  max-width: 500px;
  margin: 40px auto;
  font-family: sans-serif;
}
form {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
  flex-wrap: wrap;
}
input {
  padding: 8px;
  flex: 1;
  min-width: 100px;
}
ul {
  list-style: none;
  padding: 0;
}
li {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 0;
  border-bottom: 1px solid #eee;
}
li strong {
  flex: 0 0 auto;
}
li span {
  flex: 1;
}
</style>
