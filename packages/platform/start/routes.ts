/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router';
import { middleware } from '#start/kernel';

const AuthController = () => import('#controllers/auth_controller');
const ProfilesController = () => import('#controllers/profiles_controller');

// Home - accessible to both guests and authenticated users
router.on('/').renderInertia('home').use(middleware.silentAuth());

// Guest routes (not authenticated)
router
  .group(() => {
    router.get('/register', [AuthController, 'showRegister']).as('auth.register.show');
    router.post('/register', [AuthController, 'register']).as('auth.register');
    router.get('/login', [AuthController, 'showLogin']).as('auth.login.show');
    router.post('/login', [AuthController, 'login']).as('auth.login');
  })
  .use(middleware.guest());

// Authenticated routes
router
  .group(() => {
    router.post('/logout', [AuthController, 'logout']).as('auth.logout');
    router.get('/profile', [ProfilesController, 'show']).as('profile.show');
  })
  .use(middleware.auth());
