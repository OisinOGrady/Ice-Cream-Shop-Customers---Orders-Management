import { ref } from 'vue';
export const customers = ref([
{ customerId: 1, name: 'John Doe', paymentInfo: {cardNumber: '1234-5678-9012-3456', expirationDate: '12/25', CVV: '123'}, phone: '123-456-7890' },
{ customerId: 2, name: 'Jane Smith', paymentInfo: {cardNumber: '6543-2109-8765-4321', expirationDate: '08/24', CVV: '456'}, phone: '098-765-4321' },
{ customerId: 3, name: 'Bob Johnson', paymentInfo: {cardNumber: '1111-2222-3333-4444', expirationDate: '05/23', CVV: '789'}, phone: '555-555-5555' },
]);
let nextId = 4;
export function getCustomer(customerId) {
return customers.value.find((c)=> c.customerId === Number(customerId));
}
export function addCustomer(customer) {
customers.value.push({ ...customer, customerId: nextId++ });
}
export function updateCustomerById(customer) {
const index = customers.value.findIndex((c)=> c.customerId === Number(customer.customerId));
if (index === -1) throw new Error('Could not find that customer.');
customers.value[index] = { ...customer };
}
export function deleteCustomerById(customerId) {
customers.value = customers.value.filter((c)=> c.customerId !== Number(customerId));
}