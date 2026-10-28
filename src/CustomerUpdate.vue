<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getCustomer, updateCustomerById } from './customers.js';

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

const error = ref('');
const fetchCustomerDetails = () => {
const idFromUrl = route.params.customerId;
try {
const data = getCustomer(idFromUrl);
if (!data) throw new Error('Could not find that customer.');
customer.value = { ...data };
} catch (e) {
error.value = "Error pre-loading: " + e.message;
}
};

onMounted(() => {
fetchCustomerDetails();
});


const updateCustomer = () => {
try {
updateCustomerById(customer.value);
router.push({
path: '/customers/list',
query: { message: 'Customer updated successfully!' }
});
} catch (e) {
error.value = "Error saving: " + e.message;
}
};
</script>

<template>
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
<input type="text" id="cardNumber" v-model="customer.paymentInfo.cardNumber" /> <br />
<label for="expirationDate">Expiration Date: </label>
<input type="text" id="expirationDate" v-model="customer.paymentInfo.expirationDate" /> <br />
<label for="cvv">CVV: </label>
<input type="text" id="cvv" v-model="customer.paymentInfo.cvv" />
</p>
<p>
<label for="phone">Phone:</label><br />
<input type="text" id="phone" v-model="customer.phone" />
</p>
<p>
<button type="submit">Update Customer</button>
</p>
</form>
</div>
</template>
