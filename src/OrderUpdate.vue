<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
const API_BASE_URL = "http://localhost:3000";

const route = useRoute();
const router = useRouter();

const order = ref({
orderId: null,
product: '',
flavor: '',
toppings: '',
quantity: 1,
});

const parseResponse = async (response) => {
const text = await response.text();
let data = text;
try {
data = text ? JSON.parse(text) : null;
} catch {}
if (!response.ok) {
throw new Error((data && (data.message || data.error)) || text
|| response.statusText);
}
return data;
};

const orderCustomers = ref([]);
const allCustomers = ref([]);
const selectedCustomerId = ref('');

const availableCustomers = computed(() => {
    return allCustomers.value.filter((c) => !orderCustomers.value.some((oc) => c.customerId === oc.customerId));
});

const fetchAllCustomers = async () => {
    const res = await fetch(`${API_BASE_URL}/customers`);
    allCustomers.value = await parseResponse(res) || [];
};

const error = ref('');

const fetchOrderDetails = async () => {
const idFromUrl = route.params.orderId;
try {
    const response = await fetch(`${API_BASE_URL}/orders/${idFromUrl}`);
    const data = await parseResponse(response);
    if (!data) throw new Error('Order not found');
    order.value = { orderId: data.orderId, product: data.product, flavor: data.flavor, toppings: data.toppings, quantity: data.quantity };
    orderCustomers.value = data.customers || [];
} catch (e) {
    error.value = 'Error pre-loading: ' + e.message;
}
};

const updateOrder = async () => {
error.value = '';
try {
    const response = await fetch(`${API_BASE_URL}/orders/${order.value.orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(order.value),
    });
    await parseResponse(response);
    router.push({
path: '/orders/list',
query: {
    message: 'Order updated successfully!'
}
});
} catch (e) {
    error.value = 'Error updating order: ' + e.message;
}
};

onMounted(() => {
fetchOrderDetails();
fetchAllCustomers();
});

const removeCustomer = async (customerId) => {
const res = await fetch(`${API_BASE_URL}/orders/${order.value.orderId}/customers/${customerId}`,{ method: 'DELETE' });
if (!res.ok) alert('Failed to remove customer.');
else await fetchOrderDetails();
};

const addCustomer = async () => {
if (!selectedCustomerId.value) return;
const res = await fetch( `${API_BASE_URL}/orders/${order.value.orderId}/customers/${selectedCustomerId.value}`,{ method: 'PUT' });
if (!res.ok) alert('Failed to add customer.');
else { selectedCustomerId.value = ''; await fetchOrderDetails(); }
};

</script>

<template>
<p v-if="error" class="error">{{ error }}</p>
    <div>
<form v-if="order.orderId" @submit.prevent="updateOrder">
<input type="hidden" v-model="order.orderId" />
<p>
<label for="product">Product:</label><br />
<input type="text" id="product" v-model="order.product" required />
</p>
<p>
<label for="flavor">Flavor:</label><br />
<input type="text" id="flavor" v-model="order.flavor" required />
</p>
<p>
<label for="toppings">Toppings:</label><br />
<input type="text" id="toppings" v-model="order.toppings" />
</p>
<p>
<label for="quantity">Quantity:</label><br />
<input type="number" id="quantity" min="1" v-model="order.quantity" required />
</p>
<p>
<button type="submit">Update Order</button>
</p>
</form>
</div>

<!-- Customers managed by this order -->
<div v-if="order.orderId" class="customers-section">
<hr /><h2>Customers of this Order</h2>
<ul>
<li v-for="customer in orderCustomers" :key="customer.customerId">
{{ customer.customerId }} ({{ customer.name }})
<button @click.prevent="removeCustomer(customer.customerId)">Remove</button>
</li>
</ul>
<p v-if="!orderCustomers || orderCustomers.length === 0">No customers
assigned.</p>

<h3>Add a Customer</h3>
<select v-model="selectedCustomerId">
<option disabled value="">Please select one</option>
<option v-for="customer in availableCustomers" :key="customer.customerId" :value="customer.customerId">
{{ customer.customerId }} ({{ customer.name }})
</option>
</select>
<button @click.prevent="addCustomer" :disabled="!selectedCustomerId">Add
Customer</button>
</div>
<p><router-link to="/orders/list">🔙 Back to Order List</router-link></p>
</template>
