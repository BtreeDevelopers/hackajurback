import credorModel from '@/resources/models/credorModel';
import Controller from '@/utils/interfaces/controllerInterface';
import { Router, Request, Response } from 'express';
import { z } from 'zod';

class CredorController implements Controller {
    path = '/credor';
    router: Router;

    constructor() {
        this.router = Router();
    }

    public async initialiseRoutes(): Promise<void> {
        this.router.post(`${this.path}`, this.createNewCredor);
    }
    private async createNewCredor(req: Request, res: Response): Promise<any> {
        try {
            const newUserBody = z.object({
                nome: z.string().min(1),
                nacionalidade: z.string().min(1),
                estadocivil: z.string().min(1),
                profissao: z.string().min(1),
                domicílio: z.string().min(1),
                numeroRecidencia: z.string().min(1),
                bairro: z.string().min(1),
                cidade: z.string().min(1),
                estado: z.string().min(1),
                cep: z.string().min(1),
            });

            const {
                nome,
                nacionalidade,
                estadocivil,
                profissao,
                domicílio,
                numeroRecidencia,
                bairro,
                cidade,
                estado,
                cep,
            } = newUserBody.parse(req.body);

            const user = await credorModel.findOne({ nome });

            if (!user) {
                const data = await credorModel.create({
                    nome,
                });

                return res.status(201).json({
                    data: { nome: data.nome, _id: data._id },
                });
            } else {
                return res.status(400).json({ message: 'usuário já criado' });
            }
        } catch (error: any) {
            return res.status(401).json(error);
        }
    }
}
