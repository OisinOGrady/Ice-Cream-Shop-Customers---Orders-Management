//Imported Customer Data Operations
import {customers, getCustomer, addCustomer, updateCustomerById, deleteCustomerById, addOrderToCustomer, deleteOrderFromCustomer}from './customers.js';
import {getOrder, getOrders, getOrderDetails, addOrder, updateOrderById, deleteOrderById, addCustomerToOrder, deleteCustomerFromOrder} from './orders.js';
import swaggerUi from 'swagger-ui-express';
import express from 'express';
import cors from 'cors';
const app = express();
const PORT = 3000;


app.use(cors());
app.use(express.json());

// API Customer Operations
app.get('/customers', (req, res) => {
    const customerList = customers
    res.json(customerList.value);
})

app.get('/customers/:customerId', (req, res) => {
    const customerId = req.params.customerId;
    const customer = getCustomer(customerId);
    if (!customer) {
        res.status(404).json({ error: 'Customer not found' });
    } else {
        res.json(customer);
    }
})

app.post('/customers', (req, res) => {
    try {
    res.status(201).json(addCustomer(req.body));
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
})

app.put('/customers/:customerId', (req, res) => {
    const id = Number(req.params.customerId);
  if (!getCustomer(id)) return res.status(404).json({ error: 'Customer not found' });
  try {
    updateCustomerById({ ...req.body, customerId: id });
    res.json(getCustomer(id));
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
})

app.delete('/customers/:customerId', (req, res) => {
    const customerId = req.params.customerId;
    const customer = deleteCustomerById(customerId);
    if (!customer) {
        res.status(404).json({ error: 'Customer not found' });
    } else {
        res.json({ message: 'Customer deleted successfully' });
    }
})

app.put('/customers/:customerId/orders/:orderId', (req, res) => {
    const customerId = req.params.customerId;
    const orderId = req.params.orderId;
    try {
        addOrderToCustomer(customerId, orderId);
        res.json({ message: 'Order added to customer successfully' });
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
})

app.delete('/customers/:customerId/orders/:orderId', (req, res) => {
    const customerId = req.params.customerId;
    const orderId = req.params.orderId;
    try {
        deleteOrderFromCustomer(customerId, orderId);
        res.json({ message: 'Order deleted from customer successfully' });
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
})

// API Order Operations
app.get('/orders', (req, res) => {
    const orderList = getOrders();
    res.json(orderList);
})

app.get('/orders/:orderId', (req, res) => {
    const orderId = req.params.orderId;
    const order = getOrderDetails(orderId);
    if (!order) {
        res.status(404).json({ error: 'Order not found' });
    } else {
        res.json(order);
    }
})

app.post('/orders', (req, res) => {
    try {
    res.status(201).json(addOrder(req.body));
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
})

app.put('/orders/:orderId', (req, res) => {
    const id = Number(req.params.orderId);
  if (!getOrder(id)) return res.status(404).json({ error: 'Order not found' });
  try {
    updateOrderById({ ...req.body, orderId: id });
    res.json(getOrderDetails(id));
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
})

app.delete('/orders/:orderId', (req, res) => {
    const orderId = req.params.orderId;
    const order = deleteOrderById(orderId);
    if (!order) {
        res.status(404).json({ error: 'Order not found' });
    } else {
        res.json({ message: 'Order deleted successfully' });
    }
})

app.put('/orders/:orderId/customers/:customerId', (req, res) => {
    const orderId = req.params.orderId;
    const customerId = req.params.customerId;
    try {
        addCustomerToOrder(orderId, customerId);
        res.json({ message: 'Customer added to order successfully' });
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
})

app.delete('/orders/:orderId/customers/:customerId', (req, res) => {
    const orderId = req.params.orderId;
    const customerId = req.params.customerId;
    try {
        deleteCustomerFromOrder(orderId, customerId);
        res.json({ message: 'Customer deleted from order successfully' });
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
})

// Swagger Documentation
const customerExample = {
    customerId: 1,
    name: 'John Doe',
    paymentInfo: { cardNumber: '1234-5678-9012-3456', expirationDate: '12/25', cvv: '123' },
    phone: '123-456-7890',
    customerOrders: [{ orderId: 1, product: 'Bowl', flavor: 'Vanilla', toppings: 'Sprinkles', quantity: 2 }]
};
 
const jsonBody = (schemaRef) => ({ 'application/json': { schema: { $ref: schemaRef } } });
const errorResponse = (description, message) => ({
    description,
    content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' }, example: { error: message } } }
});
const messageResponse = (description, message) => ({
    description,
    content: { 'application/json': { schema: { $ref: '#/components/schemas/Message' }, example: { message } } }
});
 
const customerIdParam = {
    name: 'customerId', in: 'path', required: true,
    description: 'Numeric ID of the customer', schema: { type: 'integer', example: 1 }
};
const orderIdParam = {
    name: 'orderId', in: 'path', required: true,
    description: 'Numeric ID of the order', schema: { type: 'integer', example: 2 }
};
 
const swaggerDocument = {
    openapi: '3.0.3',
    info: {
        title: 'Ice Cream Shop Customer API',
        version: '1.0.0',
        description: 'Create, read, update and delete customers and orders, and add or remove the relationship from either side.'
    },
    servers: [{ url: `http://localhost:${PORT}` }],
    tags: [{ name: 'Customers' }, { name: 'Customer Orders' }, { name: 'Orders' }, { name: 'Order Customers' }],
    paths: {
        '/customers': {
            get: {
                tags: ['Customers'],
                summary: 'List all customers',
                responses: {
                    200: {
                        description: 'Array of customers',
                        content: {
                            'application/json': {
                                schema: { type: 'array', items: { $ref: '#/components/schemas/Customer' } }
                            }
                        }
                    }
                }
            },
            post: {
                tags: ['Customers'],
                summary: 'Create a customer',
                description: 'The customerId is assigned by the server and the customer starts with no orders.',
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/CustomerInput' },
                            example: {
                                name: 'Alice Brown',
                                paymentInfo: { cardNumber: '1111-2222-3333-4444', expirationDate: '01/30', cvv: '123' },
                                phone: '555-123-4567'
                            }
                        }
                    }
                },
                responses: {
                    201: { description: 'Customer created', content: jsonBody('#/components/schemas/Customer') },
                    400: errorResponse('Validation failed', 'Card number must be in the format XXXX-XXXX-XXXX-XXXX.')
                }
            }
        },
        '/customers/{customerId}': {
            get: {
                tags: ['Customers'],
                summary: 'Get one customer',
                parameters: [customerIdParam],
                responses: {
                    200: { description: 'The customer', content: jsonBody('#/components/schemas/Customer') },
                    404: errorResponse('Customer not found', 'Customer not found')
                }
            },
            put: {
                tags: ['Customers'],
                summary: 'Update a customer',
                description: 'Replaces name, paymentInfo and phone. The customer\'s existing orders are kept.',
                parameters: [customerIdParam],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/CustomerInput' },
                            example: {
                                name: 'John Edited',
                                paymentInfo: { cardNumber: '1234-5678-9012-3456', expirationDate: '12/25', cvv: '123' },
                                phone: '123-456-7890'
                            }
                        }
                    }
                },
                responses: {
                    200: { description: 'Updated customer', content: jsonBody('#/components/schemas/Customer') },
                    400: errorResponse('Validation failed', 'Phone number must be in the format XXX-XXX-XXXX.'),
                    404: errorResponse('Customer not found', 'Customer not found')
                }
            },
            delete: {
                tags: ['Customers'],
                summary: 'Delete a customer',
                parameters: [customerIdParam],
                responses: {
                    200: messageResponse('Customer deleted', 'Customer deleted successfully'),
                    404: errorResponse('Customer not found', 'Customer not found')
                }
            }
        },
        '/customers/{customerId}/orders/{orderId}': {
            put: {
                tags: ['Customer Orders'],
                summary: 'Add an existing order to a customer',
                description: 'Adding an order the customer already has does nothing.',
                parameters: [customerIdParam, orderIdParam],
                responses: {
                    200: messageResponse('Order added', 'Order added to customer successfully'),
                    404: errorResponse('Order or customer not found', 'Could not find that order.')
                }
            },
            delete: {
                tags: ['Customer Orders'],
                summary: 'Remove an order from a customer',
                parameters: [customerIdParam, orderIdParam],
                responses: {
                    200: messageResponse('Order removed', 'Order deleted from customer successfully'),
                    404: errorResponse('Customer not found', 'Could not find that customer.')
                }
            }
        },
        '/orders': {
            get: {
                tags: ['Orders'],
                summary: 'List all orders',
                responses: {
                    200: {
                        description: 'Array of orders, each with the customers that have that order',
                        content: {
                            'application/json': {
                                schema: { type: 'array', items: { $ref: '#/components/schemas/OrderWithCustomers' } }
                            }
                        }
                    }
                }
            },
            post: {
                tags: ['Orders'],
                summary: 'Create an order',
                description: 'The orderId is assigned by the server. Quantity must be greater than zero.',
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/OrderInput' },
                            example: {
                                product: 'Cone',
                                flavor: 'Mint',
                                toppings: 'Chocolate Chips',
                                quantity: 1
                            }
                        }
                    }
                },
                responses: {
                    201: { description: 'Order created', content: jsonBody('#/components/schemas/Order') },
                    400: errorResponse('Validation failed', 'Quantity must be greater than zero.')
                }
            }
        },
        '/orders/{orderId}': {
            get: {
                tags: ['Orders'],
                summary: 'Get one order',
                parameters: [orderIdParam],
                responses: {
                    200: { description: 'The order and the customers who have it', content: jsonBody('#/components/schemas/OrderWithCustomers') },
                    404: errorResponse('Order not found', 'Order not found')
                }
            },
            put: {
                tags: ['Orders'],
                summary: 'Update an order',
                description: 'Replaces product, flavor, toppings and quantity. Customers who already have this order keep it, with the new order details.',
                parameters: [orderIdParam],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/OrderInput' },
                            example: {
                                product: 'Bowl',
                                flavor: 'Vanilla',
                                toppings: 'Cherries',
                                quantity: 4
                            }
                        }
                    }
                },
                responses: {
                    200: { description: 'Updated order', content: jsonBody('#/components/schemas/OrderWithCustomers') },
                    400: errorResponse('Validation failed', 'Quantity must be greater than zero.'),
                    404: errorResponse('Order not found', 'Order not found')
                }
            },
            delete: {
                tags: ['Orders'],
                summary: 'Delete an order',
                description: 'Also removes this order from every customer who had it.',
                parameters: [orderIdParam],
                responses: {
                    200: messageResponse('Order deleted', 'Order deleted successfully'),
                    404: errorResponse('Order not found', 'Order not found')
                }
            }
        },
        '/orders/{orderId}/customers/{customerId}': {
            put: {
                tags: ['Order Customers'],
                summary: 'Add an existing customer to an order',
                description: 'Same relationship as adding the order on the customer. Adding a customer the order already has does nothing.',
                parameters: [orderIdParam, customerIdParam],
                responses: {
                    200: messageResponse('Customer added', 'Customer added to order successfully'),
                    404: errorResponse('Order or customer not found', 'Could not find that customer.')
                }
            },
            delete: {
                tags: ['Order Customers'],
                summary: 'Remove a customer from an order',
                parameters: [orderIdParam, customerIdParam],
                responses: {
                    200: messageResponse('Customer removed', 'Customer deleted from order successfully'),
                    404: errorResponse('Order or customer not found', 'Could not find that order.')
                }
            }
        }
    },
    components: {
        schemas: {
            PaymentInfo: {
                type: 'object',
                required: ['cardNumber', 'expirationDate', 'cvv'],
                properties: {
                    cardNumber: { type: 'string', description: 'Must be 19 characters', example: '1234-5678-9012-3456' },
                    expirationDate: { type: 'string', description: 'Must be 5 characters', example: '12/25' },
                    cvv: { type: 'string', description: 'Must be 3 characters', example: '123' }
                }
            },
            Order: {
                type: 'object',
                properties: {
                    orderId: { type: 'integer', example: 1 },
                    product: { type: 'string', example: 'Bowl' },
                    flavor: { type: 'string', example: 'Vanilla' },
                    toppings: { type: 'string', example: 'Sprinkles' },
                    quantity: { type: 'integer', example: 2 }
                }
            },
            OrderInput: {
                type: 'object',
                required: ['product', 'flavor', 'quantity'],
                properties: {
                    product: { type: 'string', example: 'Cone' },
                    flavor: { type: 'string', example: 'Mint' },
                    toppings: { type: 'string', example: 'Chocolate Chips' },
                    quantity: { type: 'integer', description: 'Must be greater than zero', example: 1 }
                }
            },
            CustomerSummary: {
                type: 'object',
                properties: {
                    customerId: { type: 'integer', example: 1 },
                    name: { type: 'string', example: 'John Doe' },
                    phone: { type: 'string', example: '123-456-7890' }
                }
            },
            OrderWithCustomers: {
                allOf: [
                    { $ref: '#/components/schemas/Order' },
                    {
                        type: 'object',
                        properties: {
                            customers: { type: 'array', items: { $ref: '#/components/schemas/CustomerSummary' } }
                        }
                    }
                ]
            },
            CustomerInput: {
                type: 'object',
                required: ['name', 'paymentInfo', 'phone'],
                properties: {
                    name: { type: 'string', example: 'John Doe' },
                    paymentInfo: { $ref: '#/components/schemas/PaymentInfo' },
                    phone: { type: 'string', description: 'Must be 12 characters', example: '123-456-7890' }
                }
            },
            Customer: {
                type: 'object',
                properties: {
                    customerId: { type: 'integer', example: 1 },
                    name: { type: 'string', example: 'John Doe' },
                    paymentInfo: { $ref: '#/components/schemas/PaymentInfo' },
                    phone: { type: 'string', example: '123-456-7890' },
                    customerOrders: { type: 'array', items: { $ref: '#/components/schemas/Order' } }
                },
                example: customerExample
            },
            Message: {
                type: 'object',
                properties: { message: { type: 'string' } }
            },
            Error: {
                type: 'object',
                properties: { error: { type: 'string' } }
            }
        }
    }
};
 
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.get('/api-docs.json', (req, res) => res.json(swaggerDocument));
 

// Server Initialization
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}/customers`);
    console.log(`Orders available at http://localhost:${PORT}/orders`);
    console.log(`Swagger docs available at http://localhost:${PORT}/api-docs`);
})