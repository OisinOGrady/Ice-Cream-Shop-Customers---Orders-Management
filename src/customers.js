import { ref } from 'vue';
import { getOrder } from './orders.js';

export const customers = ref([
{ customerId: 1, name: 'John Doe', paymentInfo: {cardNumber: '1234-5678-9012-3456', expirationDate: '12/28', cvv: '123'}, phone: '123-456-7890', customerOrders: [{ orderId: 1, product: 'Bowl', flavor: 'Vanilla', toppings: 'Sprinkles', quantity: 2 }] },
{ customerId: 2, name: 'Jane Smith', paymentInfo: {cardNumber: '6543-2109-8765-4321', expirationDate: '08/30', cvv: '456'}, phone: '098-765-4321', customerOrders: [] },
{ customerId: 3, name: 'Bob Johnson', paymentInfo: {cardNumber: '1111-2222-3333-4444', expirationDate: '05/32', cvv: '789'}, phone: '555-555-5555', customerOrders: [] },
]);

export function getValidExpirationDates(yearsAhead = 10) {
  const dates = [];                                   // new array on every call
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;

  for (let y = currentYear; y <= currentYear + yearsAhead; y++) {
    const startMonth = (y === currentYear) ? currentMonth : 1;
    const endMonth = (y === currentYear + yearsAhead) ? currentMonth : 12;
    for (let m = startMonth; m <= endMonth; m++) {
      dates.push(`${String(m).padStart(2, '0')}/${String(y).slice(-2)}`);
    }
  }
  return dates;
}

let nextId = 4;
export function getCustomer(customerId) {
return customers.value.find((c)=> c.customerId === Number(customerId));
}

export function addCustomer(customer) {
    const cardRegex = /^\d{4}-\d{4}-\d{4}-\d{4}$/;
    const cvvRegex = /^\d{3}$/;
    const phoneRegex = /^\d{3}-\d{3}-\d{4}$/;
    if (!customer.paymentInfo || !cardRegex.test(customer.paymentInfo.cardNumber)) {
        throw new Error('Card number must be in the format XXXX-XXXX-XXXX-XXXX.');
    }
    if (!getValidExpirationDates().includes(customer.paymentInfo.expirationDate)) {
        throw new Error('Expiration date is not valid.');
    }
    if (!cvvRegex.test(customer.paymentInfo.cvv)) {
        throw new Error('CVV must be a 3-digit number.');
    }
    if (!phoneRegex.test(customer.phone)) {
        throw new Error('Phone number must be in the format XXX-XXX-XXXX.');
    }
    const created = { ...customer, customerId: nextId++, customerOrders: [] };
    customers.value.push(created);
    return created;
}


export function updateCustomerById(customer) {
const cardRegex = /^\d{4}-\d{4}-\d{4}-\d{4}$/;
const cvvRegex = /^\d{3}$/;
const phoneRegex = /^\d{3}-\d{3}-\d{4}$/;
const index = customers.value.findIndex((c)=> c.customerId === Number(customer.customerId));
if (index === -1) throw new Error('Could not find that customer.');
if (!customer.paymentInfo || !cardRegex.test(customer.paymentInfo.cardNumber)) {
        throw new Error('Card number must be in the format XXXX-XXXX-XXXX-XXXX.');
    }
    if (!getValidExpirationDates().includes(customer.paymentInfo.expirationDate)) {
        throw new Error('Expiration date is not valid.');
    }
    if (!cvvRegex.test(customer.paymentInfo.cvv)) {
        throw new Error('CVV must be a 3-digit number.');
    }
    if (!phoneRegex.test(customer.phone)) {
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