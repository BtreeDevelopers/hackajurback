import auth from '@/middleware/authMiddleware';
import dividaModel from '@/resources/models/dividaModel';
import credorModel from '@/resources/models/dividaModel';
import statusDivida from '@/utils/enum/statusDividaENUM';
import Controller from '@/utils/interfaces/controllerInterface';
import { Router, Request, Response } from 'express';
import { z } from 'zod';

class DividaController implements Controller {
    path = '/divida';
    router: Router;

    constructor() {
        this.router = Router();
    }

    public async initialiseRoutes(): Promise<void> {
        this.router.post(`${this.path}`, this.createNewDivida);
        this.router.get(`${this.path}`, auth, this.listUserDivida);
    }
    private async createNewDivida(req: Request, res: Response): Promise<any> {
        try {
            const newDividaBody = z.object({
                nome: z.string().min(1),
                status: z.number(),
                saldo: z.number(),
                contrato: z.string(),
                userId: z.string(),
                termoconfissaodivida: z.string(),
                propostas: z.array(z.string()),
                propostaescolhida: z.string(),
                forma_de_pagamento: z.string(),
            });

            const {
                nome,
                status,
                saldo,
                contrato,
                userId,
                termoconfissaodivida,
                propostas,
                propostaescolhida,
                forma_de_pagamento,
            } = newDividaBody.parse(req.body);

            const data = await dividaModel.create({
                nome,
                status,
                saldo,
                contrato,
                userId,
                termoconfissaodivida,
                propostas,
                propostaescolhida,
                forma_de_pagamento,
            });

            return res.status(201).json({
                data: { nome: data.nome, _id: data._id },
            });
        } catch (error: any) {
            return res.status(401).json(error);
        }
    }

    private async listUserDivida(req: Request, res: Response): Promise<any> {
        const dividas = await dividaModel.find({
            userId: req.userId,
        });
        const div = dividas.map((element) => {
            return {
                _id: element._id,
                nome: element.nome,
                status: statusDivida[element.status],
                saldo: element.saldo,
                contrato: element.contrato,
                userId: element.userId,
                termoconfissaodivida: element.termoconfissaodivida,
                propostas: element.propostas,
                propostaescolhida: element.propostaescolhida,
                forma_de_pagamento: element.forma_de_pagamento,
            };
        });

        return res.status(201).json({ dividas: div });
    }
}

export default DividaController;
