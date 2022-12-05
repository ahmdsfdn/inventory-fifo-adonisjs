/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'

Route.get('/', async () => {
  return { hello: 'world' }
})

Route.post('login', 'AuthController.login')
Route.post('register', 'AuthController.register')

Route.resource('users', 'UsersController').middleware({
  '*': ['auth'],
})

Route.resource('products', 'ProductsController').middleware({
  '*': ['auth'],
})

Route.resource('customers', 'CustomersController').middleware({
  '*': ['auth'],
})

Route.resource('suppliers', 'SuppliersController').middleware({
  '*': ['auth'],
})

Route.resource('purchases', 'PurchasesController').middleware({
  '*': ['auth'],
})
Route.post('approve/:id', 'PurchasesController.approve').middleware('auth').prefix('purchases');

Route.resource('sales', 'SalesController').middleware({
  '*': ['auth'],
})

Route.post('approve/:id', 'SalesController.approve').middleware('auth').prefix('sales');

// Report
Route.get('history_report','ReportsController.history_report').middleware('auth');
Route.get('summary_stocks','ReportsController.summary_stock').middleware('auth');
