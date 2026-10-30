<script setup>
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import { customers, deleteCustomerById } from './customers.js';
// --- State Definitions using ref ---
const route = useRoute(); // Access the current route object
// Read flash message/error from query parameters on load
const message = ref(route.query.message || '');
const error = ref(route.query.error || '');

const deleteCustomer = (customerId, customerName) => {
if (confirm(`Are you sure you want to delete customer '${customerName}'?`)) {
try {
deleteCustomerById(customerId);
message.value = `Customer '${customerName}' deleted successfully!`;
error.value = '';
} catch (e) {
error.value = 'Error deleting customer: ' + e.message;
message.value = '';
}
}
};
</script>

<template>
<div>
<p v-if="message" class="success">{{ message }}</p>
<p v-if="error" class="error">{{ error }}</p>
<h1>Customer List</h1>
<p>
<router-link to="/customers/create">Create New Customer</router-link>
</p>
    <table border="1">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Phone</th>
                    <th>Actions</th>
                </tr>
            </thead>
        <tbody>
    <tr v-for="customer in customers" :key="customer.customerId">
        <td>{{ customer.customerId }}</td>
        <td>
            <router-link :to="{ name: 'CustomerUpdate', params: { customerId:
            customer.customerId } }">
            {{ customer.name }}
            </router-link>
        </td>
        <td>{{ customer.phone }}</td>
        <td>
        <button @click="deleteCustomer(customer.customerId, customer.name)">Delete</button>
        </td>
    </tr>
</tbody>
</table>
</div>
</template>