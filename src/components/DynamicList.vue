<template>
    <h3> {{ title }} </h3>
    <div>
        <input v-model="zutatField" placeholder="Zutat" type="text">
        <input v-model="mengeField" placeholder="Menge" type="number">
        <input v-model="einheitField" placeholder="Einheit" type="text">
        <button type="button" @click="save()">Save</button>
    </div>
    <div>
        <table>
            <thead>
            <tr>
                <th>Zutat</th>
                <th>Menge</th>
                <th>Einheit</th>
            </tr>
            </thead>
            <tbody>
            <tr v-if="zutat.length === 0">
                <td colspan="2">Liste leer</td>
            </tr>
            <tr v-for="item in zutat" :key="item.id">
                <td>{{item.zutat}}</td>
                <td>{{item.menge}}</td>
                <td>{{item.einheit}}</td>
            </tr>
            <tr>
                <td>{{ zutatField }}</td>
                <td>{{ mengeField }}</td>
                <td>{{ einheitField }}</td>
            </tr>
            </tbody>
        </table>
    </div>
</template>

<script setup lang="ts">
import {ref, onMounted} from 'vue'
import axios from 'axios'
import type {AxiosResponse} from 'axios'
//import type {Zutat} from '@/types'
import type {Ref} from 'vue'

defineProps<{
    title: string
}>()

type Zutat = { id?: number, zutat: string, menge: number, einheit: string}

const zutat: Ref<Zutat[]> = ref([])
const zutatField = ref('')
const mengeField = ref(0)
const einheitField = ref('')

async function loadZutaten () {
  const baseUrl = import.meta.env.VITE_BACKEND_BASE_URL // 'http://localhost:8080' in dev mode
  const endpoint = baseUrl + '/zutaten'
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
        einheit: einheitField.value
    }
    const response: AxiosResponse = await axios.post(endpoint, data);
    const responseData: Zutat = response.data;
    console.log('Success:', responseData)

}

// Lifecycle hooks
onMounted(() => {
    loadZutaten()
})
</script>

<style scoped>
h3 {
    text-align: center;
}
table {
    margin-left: auto;
    margin-right: auto;
}
button {
    color: blue;
}
</style>