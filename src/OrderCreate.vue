<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { addOrder } from './orders.js';
const router = useRouter();

const order = ref({
product: '',
flavor: '',
toppings: '',
quantity: 0,
});
const error = ref('');

const createOrder = () => {
try {
  addOrder(order.value);
  // Redirect on success, using query parameters for the message
  router.push({
    path: '/orders/list',
    query: {
      message: `Order for '${order.value.product}' created successfully!`,
    },
  });
} catch (e) {
  error.value = 'Error creating order: ' + e.message;
}
};
</script>

<template>
<div>
     <form @submit.prevent="createOrder">
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