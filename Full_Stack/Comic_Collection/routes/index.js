import mainRoutes from './main.js';

const constructorMethod = (app) => {
  app.use('/api/comics', mainRoutes);

  app.use('*', (req, res) => {
    res.status(404).json({error: 'Not found'});
  });
};

export default constructorMethod;
