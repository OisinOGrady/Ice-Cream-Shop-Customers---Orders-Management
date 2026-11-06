<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
const API_BASE_URL = "https://rest-icecream.onrender.com";

const parseResponse = async (response) => {
  const text = await response.text();
  let data = text;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {}
  if (!response.ok) {
    throw new Error((data && (data.message || data.error)) || text || response.statusText);
  }
  return data;
};

const router = useRouter();
const order = ref({
product: '',
flavor: '',
toppings: '',
quantity: 0,
});
const error = ref('');

const createOrder = async () => {
  error.value = '';
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
      message: `Order created successfully!`,
    },
  });
} catch (e) {
  error.value = 'Error creating order: ' + e.message;
}
}; //router.push() redirects the user back to the list view and passes a success message via URL query parameters."

</script>

<template>
<div> <!-- *v-model provides two-way data binding, keeping our input fields and reactive JS object synchronized on every keystroke-->
  <p v-if="error" class="error">{{ error }}</p>
     <form @submit.prevent="createOrder"> <!--intercepts form submission so Vue can handle it asynchronously-->
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
      <input type="number" id="quantity" v-model="order.quantity" required />
    </p>
    <p><button type="submit">Create Order</button></p>
  </form>
</div>
</template>