<script setup>
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import { orders, deleteOrderById } from './orders.js';
// --- State Definitions using ref --
const route = useRoute(); // Access the current route object
// Read flash message/error from query parameters on load
const message = ref(route.query.message || '');
const error = ref(route.query.error || '');

const deleteOrder = (orderId, productName) => {
if (confirm(`Are you sure you want to delete order '${productName}'?`)) {
  try {
    deleteOrderById(orderId);
    message.value = `Order '${productName}' deleted successfully!`;
    error.value = '';
  } catch (e) {
    error.value = 'Error deleting order: ' + e.message;
    message.value = '';
  }
}
};
</script>

<template>
<div>
<h1>Order List</h1>
<p>
<router-link to="/orders/create">Create New Order</router-link>
</p>
<table border="1">
     <thead>
       <tr>
         <th>ID</th>
         <th>Product</th>
         <th>Flavor</th>
         <th>Toppings</th>
         <th>Quantity</th>
         <th>Actions</th>
       </tr>
     </thead>
     <tbody>   
       <tr v-for="order in orders" :key="order.orderId">
         <td>{{ order.orderId }}</td>
         <td>
    <router-link :to="{ name: 'OrderUpdate', params: { orderId: 
    order.orderId } }">
             {{ order.product }}
           </router-link>
         </td>
         <td>{{ order.flavor }}</td>
         <td>{{ order.toppings }}</td>
         <td>{{ order.quantity }}</td>
         <td>
           <button @click="deleteOrder(order.orderId, order.product)">Delete</button>
         </td>
       </tr>
     </tbody>
   </table>
 </div>
</template>