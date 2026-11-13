<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';

const API_URl = "http://localhost:3000/customers";
// --- State Definitions using ref ---
const route = useRoute(); // Access the current route object
const customers = ref([]);
// Read flash message/error from query parameters on load
const message = ref(route.query.message || '');
const error = ref(route.query.error || '');

const fetchCustomers = async () => {
try {
const response = await fetch(API_URl);
if (!response.ok) throw new Error('Request failed with status ' + response.status);
customers.value = await response.json();
} catch (e) {
error.value = 'Error fetching customers: ' + e.message;
}
};

const deleteCustomer = async (customerId, customerName) => {
if (confirm(`Are you sure you want to delete customer '${customerName}'?`)) {
    try {const response = await fetch(`${API_URl}/${customerId}`, {method: 'DELETE' });
    if (!response.ok) throw new Error('Request failed with status ' + response.status);
    message.value = `Customer '${customerName}' deleted successfully.`;
    await fetchCustomers();
    error.value = '';
} catch (e) {
error.value = 'Error deleting customer: ' + e.message;
message.value = '';
}
};
}

onMounted(() => {
fetchCustomers();
});

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