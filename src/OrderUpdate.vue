<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getOrder, updateOrderById } from './orders.js';

const route = useRoute();
const router = useRouter();
const order = ref({
    orderId: null,
    product: '',
    flavor: '',
    toppings: '',
    quantity: 0,
});

const error = ref('');
const fetchOrderDetails = () => {
const idFromUrl = route.params.orderId;
try {
  const data = getOrder(idFromUrl);
  if (!data) throw new Error('Could not find that order.');
  order.value = { ...data };
} catch (e) {
  error.value = "Error pre-loading: " + e.message;
}
};

onMounted(() => {
fetchOrderDetails();
});

const updateOrder = () => {
  error.value = '';
try {
  updateOrderById(order.value);
  router.push({
    path: '/orders/list',
    query: { message: 'Order updated successfully!' }
  });
} catch (e) {
  error.value = "Error saving: " + e.message;
}
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
      <input type="number" id="quantity" v-model="order.quantity" required />
    </p>
  
    <p>
      <button type="submit">Update Order</button>
    </p>
  </form>
</div>
</template>