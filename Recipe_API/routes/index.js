// This file will import both route files and export the constructor method as shown in the lecture code

/*
    - When the route is /products use the routes defined in the products.js routing file
    - When the route is /reviews use the routes defined in reviews.js routing file
    - All other enpoints should respond with a 404 as shown in the lecture code
*/

import authRoutes from './auth_routes.js';
import recipeRoutes from './recipes.js';

const constructorMethod = (app) => {
    app.use('/', authRoutes);
    app.use('/recipes', recipeRoutes);

    app.use('*', (req, res) => {
        res.status(404).json({ error: 'Route Not found' });
    });
};

export default constructorMethod;

