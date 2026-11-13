<script setup>
import { ref } from 'vue';
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
// A ref holding an object (Vue automatically wraps it as a Proxy/reactive)
const paymentInformation = ref({
    cardNumber: '',
    expirationDate: '',
    cvv: '',
});
const customer = ref({
name: '',
paymentInfo: paymentInformation.value,
phone: '',
});
const error = ref('');

const createCustomer = async () => {
error.value = '';
try {
    const response = await fetch(`${API_BASE_URL}/customers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(customer.value),
    });
    await parseResponse(response);
    router.push({
path: '/customers/list',
query: {
    message: 'Customer created successfully!'
}
});
} catch (e) {
    error.value = 'Error creating customer: ' + e.message;
}
};
</script>

<template>
<p v-if="error" class="error">{{ error }}</p>
<div>
<form @submit.prevent="createCustomer()">
<p>
<label for="name">Name:</label>
<br/>
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
<input type="text" id="phone" v-model="customer.phone" required/>
</p>
<p><button type="submit">Save New Customer</button></p>
</form>
</div>
</template>