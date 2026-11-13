import { ref } from 'vue';
import { getOrder } from './orders.js';

export const customers = ref([
{ customerId: 1, name: 'John Doe', paymentInfo: {cardNumber: '1234-5678-9012-3456', expirationDate: '12/25', cvv: '123'}, phone: '123-456-7890', customerOrders: [{ orderId: 1, product: 'Bowl', flavor: 'Vanilla', toppings: 'Sprinkles', quantity: 2 }] },
{ customerId: 2, name: 'Jane Smith', paymentInfo: {cardNumber: '6543-2109-8765-4321', expirationDate: '08/24', cvv: '456'}, phone: '098-765-4321', customerOrders: [] },
{ customerId: 3, name: 'Bob Johnson', paymentInfo: {cardNumber: '1111-2222-3333-4444', expirationDate: '05/23', cvv: '789'}, phone: '555-555-5555', customerOrders: [] },
]);

let nextId = 4;
export function getCustomer(customerId) {
return customers.value.find((c)=> c.customerId === Number(customerId));
}

export function addCustomer(customer) {
    if (customer.paymentInfo.cardNumber.length !== 19) {
    throw new Error('Card number must be in the format XXXX-XXXX-XXXX-XXXX.');
    }
    if (customer.paymentInfo.expirationDate.length !== 5) {
    throw new Error('Expiration date must be in the format MM/YY.');
    }
    if (customer.paymentInfo.cvv.length !== 3) {
    throw new Error('CVV must be a 3-digit number.');
    }
    if (customer.phone.length !== 12) {
    throw new Error('Phone number must be in the format XXX-XXX-XXXX.');
    }
const created = { ...customer, customerId: nextId++, customerOrders: [] };
customers.value.push(created);
return created;
}

export function updateCustomerById(customer) {
const index = customers.value.findIndex((c)=> c.customerId === Number(customer.customerId));
if (index === -1) throw new Error('Could not find that customer.');
if (customer.paymentInfo.cardNumber.length !== 19) {
    throw new Error('Card number must be in the format XXXX-XXXX-XXXX-XXXX.');
    }
    if (customer.paymentInfo.expirationDate.length !== 5) {
    throw new Error('Expiration date must be in the format MM/YY.');
    }
    if (customer.paymentInfo.cvv.length !== 3) {
    throw new Error('CVV must be a 3-digit number.');
    }
    if (customer.phone.length !== 12) {
    throw new Error('Phone number must be in the format XXX-XXX-XXXX.');
    }
customers.value[index] = { ...customers.value[index], ...customer };
}

export function deleteCustomerById(customerId) {
const existing = getCustomer(customerId);
if (!existing) return false;
customers.value = customers.value.filter((c)=> c.customerId !== Number(customerId));
return true;
}

export function addOrderToCustomer(customerId, orderId) {
const order = getOrder(orderId);
if (!order) throw new Error('Could not find that order.');
const customer = getCustomer(customerId);
if (!customer) throw new Error('Could not find that customer.');
if (customer.customerOrders.some((o) => o.orderId === order.orderId)) return;
customer.customerOrders.push(order);
}

export function deleteOrderFromCustomer(customerId, orderId) {
const customer = getCustomer(customerId);
if (!customer) throw new Error('Could not find that customer.');
customer.customerOrders = customer.customerOrders.filter((o)=> o.orderId !== Number(orderId));
}