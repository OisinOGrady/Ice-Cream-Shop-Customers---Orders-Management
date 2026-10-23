<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getCustomer, updateCustomerById } from './customers.js';

const route = useRoute();
const router = useRouter();
const customer = ref({
customerId: null,
name: '',
paymentInfo: '',
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

</script>

<form v-if="customer.customerId" @submit.prevent="updateCustomer">
<input type="hidden" v-model="customer.customerId" />
<p>
<label for="name">Name:</label><br />
<input type="text" id="name" v-model="customer.name" required />
</p>
<p>
<label for="paymentInfo">Payment Information:</label><br />
<input type="text" id="paymentInfo" v-model="customer.paymentInfo" />
</p>
<p>
<label for="phone">Phone:</label><br />
<input type="text" id="phone" v-model="customer.phone" />
</p>
<p>
<button type="submit">Update Customer</button>
</p>
</form>

<script>
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