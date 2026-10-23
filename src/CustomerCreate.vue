<script>
const customer = ref({
name: '',
paymentInfo: '',
phone: '',
});
const error = ref('');

const createCustomer = () => {
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

<form @submit.prevent="createCustomer">
<p>
<label for="name">Name:</label>
<br />
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
<p><button type="submit">Save New Customer</button></p>
</form>