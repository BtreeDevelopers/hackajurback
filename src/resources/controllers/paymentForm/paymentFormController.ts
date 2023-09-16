import paymentFormModel from '@/resources/models/paymentFormModel';
import Controller from '@/utils/interfaces/controllerInterface';
import z, { string } from 'zod';
import { Router, Request, Response } from 'express';
import mongoose from 'mongoose';

class PaymentFormController implements Controller {
    path = '/payment';
    router: Router;

    constructor() {
        this.router = Router();
    }
    public async initialiseRoutes(): Promise<void> {
        this.router.post(`${this.path}`, this.postPayment);
    }

    private async postPayment(req: Request, res: Response): Promise<any> {
        try {
            const newUserBody = z.object({
                divida_id: z.string(),
                avalista: z.object({
                    nome: z.string().min(1),
                    cpf: z.string(),
                }).optional(),
                fiador: z.object({
                    nome: z.string().min(1),
                    cpf: z.string(),
                }).optional(),
                caucao: z.boolean().optional(),
                cartao: z.boolean().optional(),
                pix: z.boolean().optional(),
                boleto: z.boolean().optional(),
            });

            const {
                divida_id,
                avalista,
                fiador,
                caucao,
                cartao,
                pix,
                boleto,
            } = newUserBody.parse(req.body);

            const divida = await paymentFormModel.findOne({ divida_id });

            if (!divida) {
                const data = await paymentFormModel.create({
                    divida_id,
                    avalista,
                    fiador,
                    caucao,
                    cartao,
                    pix,
                    boleto,
                });

                return res.status(201).json({
                    message: 'Pagamento criado com sucesso.',
                });
            } else {
                return res.status(400).json({ message: 'Já existe um pagamento registrado para essa divida.' });
            }
        } catch (error: any) {
            return res.status(401).json(error);
        }
    }
}

export default PaymentFormController;
