<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { addCustomer } from './customers.js';
const router = useRouter();

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

const createCustomer = () => {
    error.value = '';
try {
addCustomer(customer.value);
// Redirect on success, using query parameters for the message
router.push({
path: '/customers/list',
query: {
message: `Customer '${customer.value.name}' created successfully!`,
},
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