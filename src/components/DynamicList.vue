<template>
  <div class="recipe-container">
    <div style="display: flex; align-items: center; justify-content: space-between;">
      <div style="display: flex; align-items: center;">
        <h3><button type="button" @click="deleteList(listId)" class="listedeletebutton">&#x1F5D1;</button></h3>
        <select v-model="listId" class="dropdown-menu1" @change="loadZutaten" style="margin-left: 10px;">
          <option value="" disabled>Auswählen</option>
          <option v-for="list in lists" :key="list.id" :value="list.id">{{ list.name }}</option>
        </select>
      </div>
      <div style="display: flex; align-items: center; margin-bottom: 20px">
        <h3><input v-model="namenField" placeholder="Neue Liste (Name)" type="text" maxlength="18" style="margin-right: 10px;"></h3>
        <h3><button type="button" @click="addlist">Erstellen</button></h3>
      </div>
    </div>





    <div class="form-container">
      <input v-model="zutatField" placeholder="Artikel" type="text" maxlength="18">
      <input v-model="mengeField" placeholder="Menge" type="number" @input="validateMenge" @keydown="preventE">
      <select v-model="einheitField" class="dropdown-menu">
        <option value="">Auswählen</option>
        <option value="Gramm">Gramm</option>
        <option value="Kilogramm">Kilogramm</option>
        <option value="Milliliter">Milliliter</option>
        <option value="Liter">Liter</option>
        <option value="Stück">Stück</option>
        <option value="Dose/n">Dose/n</option>
        <option value="Packung/en">Packung/en</option>
       </select>
      <button type="button" @click="addZutat()">Hinzufügen</button>
    </div>
    <div v-if="zutat.length > 0" class="table-container">
      <table>
        <thead>
        <tr>
          <th>Artikel</th>
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
import { ref, onMounted } from 'vue'
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
  await loadLists(owner);
  await loadZutaten();

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
  color:#2e85b9;
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
  border: 1px solid #2e85b9;
  border-radius: 4px;
}

button {
  background-color: #3eb26c;
  color: #fff;
  padding: 8px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.listedeletebutton {
  background-color: #bc3c3c;
  color: #fff;
  padding: 8px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bolder;
  font-size: larger;
  margin-bottom: 20px;
}

table {
  width: 124%;
  border-collapse: collapse;
  margin-top: 20px;
  table-layout: fixed;
}

th, td {
  border: 1px solid #ffffff;
  padding: 8px;
  text-align: left;
  background-color: rgba(110, 161, 192, 0.39);
}

td:last-child {
  border: none;
  background-color: transparent;
}

th {
  background-color: #2e85b9;
  color: #fff;
}

.delete-button {
  background-color: #bc3c3c;
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
  color: #000000;
  margin-top: 10px;
}
.dropdown-menu {
  padding: 8px;
  font-size: 14px;
  border: 1px solid #2e85b9;
  border-radius: 4px;
  background-color: #fff;
  color: #333;
}
.dropdown-menu1 {
  padding: 12px;
  font-size: 16px;
  border: 2px solid #2e85b9;
  border-radius: 8px;
  background-color: #2e85b9;
  color: #ffffff;
  margin-bottom: 20px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1); /* Hinzugefügt: Schatten für Tiefeneffekt */
}

/* Hover-Effekt */
.dropdown-menu1:hover {
  background-color: #2e85b9;
}

/* Übergangseffekt */
.dropdown-menu1 {
  transition: background-color 0.3s, box-shadow 0.3s;
}
</style>