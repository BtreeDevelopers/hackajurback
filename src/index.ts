import 'dotenv/config';
import 'module-alias/register';
import App from './app';
import UserController from './resources/controllers/user/userController';
import SystemStatusController from './resources/controllers/system/systemstatus';
import LoginController from './resources/controllers/login/loginController';
import CitiesController from './resources/controllers/cities/citiesController';
import DividaController from './resources/controllers/divida/dividaController';
import PaymentFormController from './resources/controllers/paymentForm/paymentFormController';

const userController = new UserController();
const systemController = new SystemStatusController();
const loginController = new LoginController();
const citiesController = new CitiesController();
const dividasController = new DividaController();
const paymentFormController = new PaymentFormController();

userController.initialiseRoutes();
systemController.initialiseRoutes();
loginController.initialiseRoutes();
citiesController.initialiseRoutes();
dividasController.initialiseRoutes();
paymentFormController.initialiseRoutes();
const app = new App(
    [
        systemController,
        userController,
        loginController,
        citiesController,
        dividasController,
        paymentFormController,
    ],
    process.env.PORT as any,
);

app.start();

app.listen(true);
