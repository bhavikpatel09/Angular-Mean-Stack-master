import * as express from 'express';


import UserCtrl from './controllers/user';


export default function setRoutes(app) {

  const router = express.Router();

  
  const userCtrl = new UserCtrl();

  // Users
  router.route('/login').post(userCtrl.login);
  router.route('/facebook').post(userCtrl.facebook);
  router.route('/twitter').post(userCtrl.twitter);
  router.route('/facebook/callback').get(userCtrl.facebookCallback);
  router.route('/twitter/callback').get(userCtrl.twitterCallback);
  router.route('/users').get(userCtrl.getAll);
  router.route('/users/count').get(userCtrl.count);
  router.route('/user').post(userCtrl.insert);
  router.route('/user/:id').get(userCtrl.get);
  router.route('/user/:id').put(userCtrl.update);
  router.route('/user/:id').delete(userCtrl.delete);

  // Apply the routes to our application with the prefix /api
  app.use('/api', router);

}
