import { createRouter, createWebHistory } from 'vue-router';
import Home from './Home.vue';
import CustomerList from './CustomerList.vue';
import CustomerCreate from './CustomerCreate.vue';
import CustomerUpdate from './CustomerUpdate.vue';
import OrderList from './OrderList.vue';
import OrderCreate from './OrderCreate.vue';
import OrderUpdate from './OrderUpdate.vue';

const routes = [
{
path: '/',
name: 'Home',
component: Home
},
{
path: '/customers/list',
name: 'CustomerList',
component: CustomerList
},
{
path: '/customers/create',
name: 'CustomerCreate',
component: CustomerCreate
},
{
path: '/customers/update/:customerId',
name: 'CustomerUpdate',
component: CustomerUpdate,
props: true
},
{
path: '/orders/list',
name: 'OrderList',
component: OrderList
},
{
path: '/orders/create',
name: 'OrderCreate',
component: OrderCreate
},
{
path: '/orders/update/:orderId',
name: 'OrderUpdate',
component: OrderUpdate,
props: true
}
];

const router = createRouter({
history: createWebHistory(),
routes
});

export default router;