<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
const API_BASE_URL = "http://localhost:3000";


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
// --- State Definitions using ref ---
const router = useRouter();
const order = ref({
product: '',
flavor: '',
toppings: '',
quantity: 1,
orderDate: '',
});
const error = ref('');
const validProducts = ref([]);
const validFlavors = ref([]);

const isValidCalendarDate = (value) => {
if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
const [year, month, day] = value.split('-').map(Number);
const date = new Date(year, month - 1, day);
return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;
};

const fetchValidProducts = async () => {
    const res = await fetch(`${API_BASE_URL}/orders/valid-products`);
    validProducts.value = await parseResponse(res) || [];
};

const fetchValidFlavors = async () => {
    const res = await fetch(`${API_BASE_URL}/orders/valid-flavors`);
    validFlavors.value = await parseResponse(res) || [];
};

const createOrder = async () => {
error.value = '';
if (!isValidCalendarDate(order.value.orderDate)) {
    error.value = 'Order date must be a valid calendar date.';
    return;
}
try {
    const response = await fetch(`${API_BASE_URL}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(order.value),
    });
    await parseResponse(response);
    router.push({
path: '/orders/list',
query: {
    message: 'Order created successfully!'
}
});
} catch (e) {
    error.value = 'Error creating order: ' + e.message;
}
};

onMounted(() => {
fetchValidProducts();
fetchValidFlavors();
});
</script>

<template>
<p v-if="error" class="error">{{ error }}</p>
<div>
<form @submit.prevent="createOrder()">
<p>
<label for="product">Product:</label>
<br/>
<select id="product" v-model="order.product" required>
    <option disabled value="">Please select a product</option>
    <option v-for="product in validProducts" :key="product" :value="product">
    {{ product }}
    </option>
</select>
</p>
<p>
<label for="flavor">Flavor:</label><br />
<select id="flavor" v-model="order.flavor" required>
    <option disabled value="">Please select a flavor</option>
    <option v-for="flavor in validFlavors" :key="flavor" :value="flavor">
    {{ flavor }}
    </option>
</select>
</p>
<p>
<label for="toppings">Toppings:</label><br />
<input type="text" id="toppings" v-model="order.toppings" />
</p>
<p>
<label for="quantity">Quantity:</label><br />
<input type="number" id="quantity" min="1" v-model.number="order.quantity" required />
</p>
<p>
<label for="orderDate">Order Date:</label><br />
<input type="date" id="orderDate" v-model="order.orderDate" required />
</p>
<p><button type="submit">Save New Order</button></p>
</form>
</div>
</template>
