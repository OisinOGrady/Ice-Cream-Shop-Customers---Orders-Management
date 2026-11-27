// Holds the raw reactive array (orders) and 
// functions (addOrder, updateOrderById, deleteOrderById, getOrder)

import { ref } from 'vue';
import { customers, addOrderToCustomer, deleteOrderFromCustomer } from './customers.js';

export const orders = ref([
{ orderId: 1, product: 'Bowl', flavor: 'Vanilla', toppings: 'Sprinkles', quantity: 2, orderDate: '2026-11-20' },
{ orderId: 2, product: 'Cone', flavor: 'Strawberry', toppings: 'Hot Fudge', quantity: 1, orderDate: '2026-11-22' },
{ orderId: 3, product: 'Bowl', flavor: 'Chocolate', toppings: 'Whipped Cream', quantity: 3, orderDate: '2026-11-25' },
]);

const VALID_PRODUCTS = ['Bowl', 'Cone', 'Shake', 'Sundae'];
const VALID_FLAVORS = ['Vanilla', 'Chocolate', 'Strawberry', 'Mint', 'Cookies and Cream'];

export function getValidProducts() {
return [...VALID_PRODUCTS];
}

export function getValidFlavors() {
return [...VALID_FLAVORS];
}

let nextId = 4;

export function getOrder(orderId) {
return orders.value.find((o) => o.orderId === Number(orderId));
}//convert string route parameters into numeric IDs for strict matching

function customersForOrder(orderId) {
return customers.value
.filter((c) => c.customerOrders.some((o) => o.orderId === Number(orderId)))
.map((c) => ({
customerId: c.customerId,
name: c.name,
phone: c.phone,
}));
}

export function getOrders() {
return orders.value.map((order) => ({ ...order, customers: customersForOrder(order.orderId) }));
}

export function getOrderDetails(orderId) {
const order = getOrder(orderId);
if (!order) return undefined;
return { ...order, customers: customersForOrder(order.orderId) };
}

function checkedQuantity(order) {
const quantity = Number(order.quantity);
if (!Number.isFinite(quantity) || quantity <= 0) {
throw new Error('Quantity must be greater than zero.');
}
return quantity;
}

function checkedProduct(order) {
if (!getValidProducts().includes(order.product)) {
throw new Error('Product is not a valid choice.');
}
return order.product;
}

function checkedFlavor(order) {
if (!getValidFlavors().includes(order.flavor)) {
throw new Error('Flavor is not a valid choice.');
}
return order.flavor;
}

function checkedOrderDate(order) {
const value = order.orderDate;
if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
throw new Error('Order date must be a valid calendar date (YYYY-MM-DD).');
}
const [year, month, day] = value.split('-').map(Number);
const date = new Date(year, month - 1, day);
if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) {
throw new Error('Order date must be a valid calendar date (YYYY-MM-DD).');
}
return value;
}

export function addOrder(order) {
const product = checkedProduct(order);
const flavor = checkedFlavor(order);
const quantity = checkedQuantity(order);
const orderDate = checkedOrderDate(order);
const created = {
orderId: nextId++,
product,
flavor,
toppings: order.toppings,
quantity,
orderDate,
};
orders.value.push(created);
return created;
}

export function updateOrderById(order) {
const index = orders.value.findIndex((o) => o.orderId === Number(order.orderId));
if (index === -1) throw new Error('Could not find that order.');
const product = checkedProduct(order);
const flavor = checkedFlavor(order);
const quantity = checkedQuantity(order);
const orderDate = checkedOrderDate(order);
const updated = {
orderId: Number(order.orderId),
product,
flavor,
toppings: order.toppings,
quantity,
orderDate,
};
orders.value[index] = updated;
for (const customer of customers.value) {
customer.customerOrders = customer.customerOrders.map((o) =>
o.orderId === updated.orderId ? { ...updated } : o
);
}
}

export function deleteOrderById(orderId) {
const existing = getOrder(orderId);
if (!existing) return false;
orders.value = orders.value.filter((o) => o.orderId !== Number(orderId));
for (const customer of customers.value) {
customer.customerOrders = customer.customerOrders.filter((o) => o.orderId !== Number(orderId));
}
return true;
}

export function addCustomerToOrder(orderId, customerId) {
addOrderToCustomer(customerId, orderId);
}

export function deleteCustomerFromOrder(orderId, customerId) {
if (!getOrder(orderId)) throw new Error('Could not find that order.');
deleteOrderFromCustomer(customerId, orderId);
}