import citiesModel from '@/resources/models/citiesModel';
import Controller from '@/utils/interfaces/controllerInterface';
import { Router, Request, Response } from 'express';
import mongoose from 'mongoose';

class CitiesController implements Controller {
    path = '/cities';
    router: Router;

    constructor() {
        this.router = Router();
    }
    public async initialiseRoutes(): Promise<void> {
        this.router.get(`${this.path}/:param`, this.getCities);
    }

    private async getCities(req: Request, res: Response): Promise<any> {
        try {
            console.log(
                !req.params.param,
                req.params.param === '',
                req.params.param,
            );
            if (!req.params.param || req.params.param === '') {
                return res.status(500).json({ message: 'Missing Params' });
            }
            let parametro = req.params.param.replace('_', ' ');
            const cities = await citiesModel
                .find({
                    slug: { $regex: parametro, $options: 'i' },
                })
                .limit(10);

            return res.status(201).json({ cities });
        } catch (error) {
            return res.status(500).json({ message: 'Something went wrong' });
        }
    }
}

export default CitiesController;
