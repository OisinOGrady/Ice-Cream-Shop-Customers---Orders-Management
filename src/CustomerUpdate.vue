<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
const API_BASE_URL = "http://localhost:3000";

const route = useRoute();
const router = useRouter();

const paymentInformation = ref({
    cardNumber: '',
    expirationDate: '',
    cvv: '',
});
const customer = ref({
customerId: null,
name: '',
paymentInfo: paymentInformation.value,
phone: '',
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

const customerOrders = ref([]);
const allOrders = ref([]);
const selectedOrderId = ref('');

const availableOrders = computed(() => {
    return allOrders.value.filter((o) => !customerOrders.value.some((co) => o.orderId === co.orderId));
});

const fetchAllOrders = async () => {
    const res = await fetch(`${API_BASE_URL}/orders`);
    allOrders.value = await parseResponse(res) || [];
};

const error = ref('');

const fetchCustomerDetails = async () => {
const idFromUrl = route.params.customerId;
try {
    const response = await fetch(`${API_BASE_URL}/customers/${idFromUrl}`);
    const data = await parseResponse(response);
    if (!data) throw new Error('Customer not found');
    customer.value = { customerId: data.customerId, name: data.name, paymentInfo: data.paymentInfo, phone: data.phone };
    customerOrders.value = data.customerOrders || [];
} catch (e) {
    error.value = 'Error pre-loading: ' + e.message;
}
};

const updateCustomer = async () => {
error.value = '';
try {
    const response = await fetch(`${API_BASE_URL}/customers/${customer.value.customerId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(customer.value),
    });
    await parseResponse(response);
    router.push({
path: '/customers/list',
query: {
    message: 'Customer updated successfully!'
}
});
} catch (e) {
    error.value = 'Error updating customer: ' + e.message;
}
};

onMounted(() => {
fetchCustomerDetails();
fetchAllOrders();
});

const removeOrder = async (orderId) => {
const res = await fetch(`${API_BASE_URL}/customers/${customer.value.customerId}/orders/${orderId}`,{ method: 'DELETE' });
if (!res.ok) alert('Failed to remove order.');
else await fetchCustomerDetails();
};

const addOrder = async () => {
if (!selectedOrderId.value) return;
const res = await fetch( `${API_BASE_URL}/customers/${customer.value.customerId}/orders/${selectedOrderId.value}`,{ method: 'PUT' });
if (!res.ok) alert('Failed to add order.');
else { selectedOrderId.value = ''; await fetchCustomerDetails(); }
};

</script>

<template>
<p v-if="error" class="error">{{ error }}</p>
    <div>
<form v-if="customer.customerId" @submit.prevent="updateCustomer">
<input type="hidden" v-model="customer.customerId" />
<p>
<label for="name">Name:</label><br />
<input type="text" id="name" v-model="customer.name" required />
</p>
<p>
<label for="paymentInfo">Payment Information:</label><br />
<label for="cardNumber">Card Number: </label>
<input type="text" id="cardNumber" v-model="customer.paymentInfo.cardNumber" required /> <br />
<label for="expirationDate">Expiration Date: </label>
<input type="text" id="expirationDate" v-model="customer.paymentInfo.expirationDate" required /> <br />
<label for="cvv">CVV: </label>
<input type="text" id="cvv" v-model="customer.paymentInfo.cvv" required />
</p>
<p>
<label for="phone">Phone:</label><br />
<input type="text" id="phone" v-model="customer.phone" required />
</p>
<p>
<button type="submit">Update Customer</button>
</p>
</form>
</div>

<!-- Orders managed by this customer -->
<div v-if="customer.customerId" class="orders-section">
<hr /><h2>Orders of this Customer</h2>
<ul>
<li v-for="order in customerOrders" :key="order.orderId">
{{ order.orderId }} ({{ order.product }})
<button @click.prevent="removeOrder(order.orderId)">Remove</button>
</li>
</ul>
<p v-if="!customerOrders || customerOrders.length === 0">No orders
assigned.</p>

<h3>Add an Order</h3>
<select v-model="selectedOrderId">
<option disabled value="">Please select one</option>
<option v-for="order in availableOrders" :key="order.orderId" :value="order.orderId">
{{ order.orderId }} ({{ order.product }})
</option>
</select>
<button @click.prevent="addOrder" :disabled="!selectedOrderId">Add
Order</button>
</div>
<p><router-link to="/customers/list">🔙 Back to Customer List</router-link></p>
</template>
