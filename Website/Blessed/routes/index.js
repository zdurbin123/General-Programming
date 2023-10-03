//Here you will import route files and export the constructor method as shown in lecture code and worked in previous labs.
import authRoutes from './auth_routes.js';
import charityRoutes from './charities.js';
import donateRoutes from './donate.js';

const constructorMethod = (app) => {
  app.use('/', authRoutes);
  app.use('/charities', charityRoutes);
  app.use('/donate', donateRoutes);
  app.use('*', (req, res) => {
    res.status(404).json({error: 'Route Not found'});
  });
};

export default constructorMethod;
