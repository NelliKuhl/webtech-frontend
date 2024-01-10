<template>
  <div class="recipe-container">
    <select v-model="listId" class="dropdown-menu1" @change="loadZutaten">
      <option value="" disabled>Auswählen</option>
      <option v-for="list in lists" :key="list.id" :value="list.id">{{ list.name }}</option>
    </select>
    <h3><input v-model="namenField" placeholder="Listenname" type="text" maxlength="18"></h3>
      <h3><button type="button" @click="addlist">+</button></h3>
    <h3><button type="button" @click="deleteList(listId)">-</button></h3>
    <div class="form-container">
      <input v-model="zutatField" placeholder="Zutat" type="text" maxlength="18">
      <input v-model="mengeField" placeholder="Menge" type="number" @input="validateMenge" @keydown="preventE">
      <select v-model="einheitField" class="dropdown-menu">
        <option value="">Auswählen</option>
        <option value="Stück">Stück</option>
        <option value="Gramm">Gramm</option>
        <option value="Liter">Liter</option>
       </select>
      <button type="button" @click="addZutat()">&#10133;</button>
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
import { ref, onMounted, type UnwrapRef, nextTick } from 'vue'
import axios from 'axios'
import type {AxiosResponse} from 'axios'
import type { List, Zutat } from '@/types'
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

const lists: Ref<List[]> = ref([])
const namenField = ref('')
const listId = ref()

const $auth = useAuth()
const email = ref('')

const selectedListName = ref('')

/**
 * Loads the lists from the backend.
 * @param email The email of the user.
 * @returns The lists.
 */
async function loadLists(owner: string = '') {
  const baseUrl = import.meta.env.VITE_BACKEND_BASE_URL;
  const endpoint = baseUrl + '/listen' + '?owner=' + owner;
  const response: AxiosResponse = await axios.get(endpoint);
  const responseData: List[] = response.data;
  responseData.forEach((item) => {
    lists.value.push(item);
  });
}

async function addlist() {
  const baseUrl = import.meta.env.VITE_BACKEND_BASE_URL
  const endpoint = baseUrl + '/listen';
    const data: List = {
        name: namenField.value,
        owner: email.value
    }
    const response: AxiosResponse = await axios.post(endpoint, data);
    const responseData: List = response.data;
    console.log('Success:', responseData)
    lists.value.push(responseData)
  namenField.value = '';
  listId.value = responseData.id;
  await loadZutaten();
}

/**
 * Deletes a list from the backend + its zutaten.
 * @param id
 */
async function deleteList(id?: number) {
  if (id) {
    const baseUrl = import.meta.env.VITE_BACKEND_BASE_URL;
    const listeEndpoint = baseUrl + '/listen/' + id;
    await axios.delete(listeEndpoint);
    lists.value = lists.value.filter((item) => item.id !== id);
    zutat.value = [];
    zutatField.value = '';
    mengeField.value = '';
    einheitField.value = '';
  }
}

/**
 * Loads the Zutaten from the backend.
 * @param listId The id of the list.
 */
async function loadZutaten() {
  if(listId.value) {
    const baseUrl = import.meta.env.VITE_BACKEND_BASE_URL;
    const endpoint = baseUrl + '/listen/' + listId.value + '/zutaten';
    const response: AxiosResponse = await axios.get(endpoint);
    const responseData: Zutat[] = response.data;
    zutat.value = responseData;
  }
}

/**
 * Adds a Zutat to the backend.
 * @param listId The id of the list.
 */
async function addZutat () {
  const baseUrl = import.meta.env.VITE_BACKEND_BASE_URL
  const endpoint = baseUrl + '/listen/'  + listId.value + '/zutaten'
    const data: Zutat = {
        zutat: zutatField.value,
        menge: mengeField.value,
        einheit: einheitField.value
    }
    const response: AxiosResponse = await axios.post(endpoint, data);
    const responseData: Zutat = response.data;
    console.log('Success:', responseData)
    zutat.value.push(responseData)
  zutatField.value = '';
  mengeField.value = '';
  einheitField.value = '';
}
/**
 * Deletes a Zutat from the backend.
 * @param id The id of the Zutat.
 */
async function deleteZutat(id?: number) {
  if (id) {
    const baseUrl = import.meta.env.VITE_BACKEND_BASE_URL;
    const endpoint = baseUrl + '/zutaten/' + id;
    await axios.delete(endpoint);
    zutat.value = zutat.value.filter((item) => item.id !== id);
  }
}
/**
 * Prevents the quantity from exceeding the maximum quantity.
 */
function validateMenge() {
  const maxMenge = 9999999;
  if (mengeField.value > maxMenge) {
    mengeField.value = maxMenge;
  }
}

/**
 * Prevents the letter 'e' from being entered in the input field.
 * @param event The keyboard event.
 */
function preventE(event: KeyboardEvent) {
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
  await loadZutaten();
  await loadLists();
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
.dropdown-menu1 {
  padding: 12px;
  font-size: 16px;
  border: 2px solid #3498db;
  border-radius: 8px;
  background-color: #3498db;
  color: #ffffff;
  margin-bottom: 20px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1); /* Hinzugefügt: Schatten für Tiefeneffekt */
}

/* Hover-Effekt */
.dropdown-menu1:hover {
  background-color: #6eb1de;
}

/* Übergangseffekt */
.dropdown-menu1 {
  transition: background-color 0.3s, box-shadow 0.3s;
}
</style>