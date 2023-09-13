import 'dotenv/config';
import 'module-alias/register';
import App from './app';
import UserController from './resources/controllers/user/userController';
import SystemStatusController from './resources/controllers/system/systemstatus';
import LoginController from './resources/controllers/login/loginController';
import CitiesController from './resources/controllers/cities/citiesController';

const userController = new UserController();
const systemController = new SystemStatusController();
const loginController = new LoginController();
const citiesController = new CitiesController();

userController.initialiseRoutes();
systemController.initialiseRoutes();
loginController.initialiseRoutes();
citiesController.initialiseRoutes();

const app = new App(
    [systemController, userController, loginController, citiesController],
    process.env.PORT as any,
);

app.start();

app.listen(true);
