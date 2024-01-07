<template>
  <div class="recipe-container">
    <h3>{{ title }}</h3>
    <div class="form-container">
      <input v-model="zutatField" placeholder="Zutat" type="text" maxlength="18">
      <input v-model="mengeField" placeholder="Menge" type="number" @input="validateMenge" @keydown="preventE">
      <select v-model="einheitField" class="dropdown-menu">
        <option value="">Auswählen</option>
        <option value="Stück">Stück</option>
        <option value="Gramm">Gramm</option>
        <option value="Liter">Liter</option>
       </select>
      <button type="button" @click="save()">&#10133;</button>
    </div>
    <div v-if="zutat.length > 0" class="table-container">
      <table>
        <thead>
        <tr>
          <th>Zutat</th>
          <th>Menge</th>
          <th>Einheit</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="item in zutat" :key="item.id">
          <td>{{ item.zutat }}</td>
          <td>{{ item.menge }}</td>
          <td>{{ item.einheit }}</td>
          <td>
            <button @click="deleteZutat(item.id)" class="delete-button">&#x1F5D1;</button>
          </td>
        </tr>
        <tr>
          <td>{{ zutatField }}</td>
          <td>{{ mengeField }}</td>
          <td>{{ einheitField }}</td>
          <td></td>
        </tr>
        </tbody>
      </table>
    </div>
    <div v-else>
      <p>Liste Leer</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref, onMounted} from 'vue'
import axios from 'axios'
import type {AxiosResponse} from 'axios'
import type {Zutat} from '@/types'
import type {Ref} from 'vue'
import { useAuth } from '@okta/okta-vue'
import type {CustomUserClaims, UserClaims } from '@okta/okta-auth-js'


defineProps<{
    title: string
}>()



const zutat: Ref<Zutat[]> = ref([])
const zutatField = ref('')
const mengeField = ref()
const einheitField = ref('')

const $auth = useAuth()
const email = ref('')

async function loadZutaten (owner: string = '') {
  const baseUrl = import.meta.env.VITE_BACKEND_BASE_URL // 'http://localhost:8080' in dev mode
  const endpoint = baseUrl + '/zutaten' + '?owner=' + owner
    const response: AxiosResponse = await axios.get(endpoint);
    const responseData: Zutat[] = response.data;
    responseData.forEach((z: Zutat) => {
        zutat.value.push(z)
    })}

async function save () {
  const baseUrl = import.meta.env.VITE_BACKEND_BASE_URL // 'http://localhost:8080' in dev mode
  const endpoint = baseUrl + '/zutaten'
    const data: Zutat = {
        zutat: zutatField.value,
        menge: mengeField.value,
        einheit: einheitField.value,
        owner: email.value
    }
    const response: AxiosResponse = await axios.post(endpoint, data);
    const responseData: Zutat = response.data;
    console.log('Success:', responseData)
    zutat.value.push(responseData)
  zutatField.value = '';
  mengeField.value = '';
  einheitField.value = '';
}
async function deleteZutat(id?: number) {
  if (id) {
    const baseUrl = import.meta.env.VITE_BACKEND_BASE_URL;
    const endpoint = baseUrl + '/zutaten/' + id;
    await axios.delete(endpoint);
    zutat.value = zutat.value.filter((item) => item.id !== id);
  }
}
function validateMenge() {
  const maxMenge = 9999999; // Hier können Sie die maximale Menge ändern
  if (mengeField.value > maxMenge) {
    mengeField.value = maxMenge; // Begrenzen Sie den Wert auf die maximale Menge
  }
}
function preventE(event: KeyboardEvent) {
  // Verhindern Sie das Einfügen von 'e'
  if (event.key === 'e') {
    event.preventDefault();
  }
}
// Lifecycle hooks
onMounted(async () => {
  let userClaims: UserClaims<CustomUserClaims> | undefined = undefined
  try {
    userClaims = await $auth.getUser()
  } catch (e) {
    console.log('Error:', e)
  }
  const owner = (userClaims === undefined || userClaims.email === undefined) ? '' : userClaims.email.toString()
  email.value = owner
  await loadZutaten(owner)
})
</script>

<style scoped>
.recipe-container {
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
}

h3 {
  text-align: center;
  color: #3498db;
}

.form-container {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  text-align: center;
}

input {
  flex: 1;
  padding: 8px;
  border: 1px solid #3498db;
  border-radius: 4px;
}

button {
  background-color: #2ecc71;
  color: #fff;
  padding: 8px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

table {
  width: 124%;
  border-collapse: collapse;
  margin-top: 20px;
  table-layout: fixed;
}

th, td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}

td:last-child {
  border: none;
}

th {
  background-color: #3498db;
  color: #fff;
}

.delete-button {
  background-color: #e74c3c;
  color: #fff;
  padding: 8px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bolder;
  font-size: larger;
}
.recipe-container > div {
  text-align: center;
  color: #999;
  margin-top: 10px;
}
.dropdown-menu {
  padding: 8px;
  font-size: 14px;
  border: 1px solid #3498db;
  border-radius: 4px;
  background-color: #fff;
  color: #333;
}
</style>