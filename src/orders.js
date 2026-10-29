import { ref } from 'vue';
export const orders = ref([
{ orderId: 1, product: 'Bowl', flavor: 'Vanilla', toppings: 'Sprinkles', quantity: 2 },
{ orderId: 2, product: 'Cone', flavor: 'Strawberry', toppings: 'Hot Fudge', quantity: 1 },
{ orderId: 3, product: 'Bowl', flavor: 'Chocolate', toppings: 'Whipped Cream', quantity: 3 },
]);
let nextId = 4;
export function getOrder(orderId) {
return orders.value.find((o) => o.orderId === Number(orderId));
}
export function addOrder(order) {
orders.value.push({ ...order, orderId: nextId++ });
}
export function updateOrderById(order) {
const index = orders.value.findIndex((o) => o.orderId === Number(order.orderId));
if (index === -1) throw new Error('Could not find that order.');
orders.value[index] = { ...order };
}
export function deleteOrderById(orderId) {
orders.value = orders.value.filter((o) => o.orderId !== Number(orderId));
}