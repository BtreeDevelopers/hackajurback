import 'dotenv/config';
import 'module-alias/register';
import App from './app';
import UserController from './resources/controllers/user/userController';
import SystemStatusController from './resources/controllers/system/systemstatus';
import LoginController from './resources/controllers/login/loginController';
import CitiesController from './resources/controllers/cities/citiesController';
import DividaController from './resources/controllers/divida/dividaController';

const userController = new UserController();
const systemController = new SystemStatusController();
const loginController = new LoginController();
const citiesController = new CitiesController();
const dividasController = new DividaController();

userController.initialiseRoutes();
systemController.initialiseRoutes();
loginController.initialiseRoutes();
citiesController.initialiseRoutes();
dividasController.initialiseRoutes();
const app = new App(
    [
        systemController,
        userController,
        loginController,
        citiesController,
        dividasController,
    ],
    process.env.PORT as any,
);

app.start();

app.listen(true);
