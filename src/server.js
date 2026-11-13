//Imported Customer Data Operations
import {customers, getCustomer, addCustomer, updateCustomerById, deleteCustomerById, addOrderToCustomer, deleteOrderFromCustomer}from './customers.js';
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
        description: 'Create, read, update and delete customers, and add or remove orders on a customer.'
    },
    servers: [{ url: `http://localhost:${PORT}` }],
    tags: [{ name: 'Customers' }, { name: 'Customer Orders' }],
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
    console.log(`Swagger docs available at http://localhost:${PORT}/api-docs`);
})