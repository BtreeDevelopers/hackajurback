import Controller from '@/utils/interfaces/controllerInterface';
import userModel from '@/resources/models/userModel';

import { Router, Request, Response } from 'express';
import z, { string } from 'zod';
import { compare } from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import mongoose from 'mongoose';
import generateToken from '@/utils/Auth/jwt.auth';
import dividaModel from '@/resources/models/dividaModel';
import statusDivida from '@/utils/enum/statusDividaENUM';

class LoginController implements Controller {
    public path = '/login';
    public router: Router;

    constructor() {
        this.router = Router();
    }

    public async initialiseRoutes(): Promise<void> {
        this.router.post(`${this.path}`, this.login);
    }

    private async login(req: Request, res: Response): Promise<any> {
        try {
            const loginUser = z.object({
                cpf: string(),
                senha: string(),
            });

            const { cpf, senha } = loginUser.parse(req.body);

            const user = await userModel
                .findOne({ cpf_cnpj: cpf })
                .populate('senha');

            if (!user) {
                return res
                    .status(401)
                    .json({ message: 'Usuário não cadastrado' });
            } else {
                const passwordMatch = await compare(senha, user.senha);
                if (!passwordMatch)
                    throw new Error('Usuário ou senha incorretos');
                const token = generateToken({ id: user._id });
                const dividas = await dividaModel.find({
                    userId: user._id,
                });
                const div = dividas.map((element) => {
                    return {
                        _id: element._id,
                nome: element.nome,
                status: statusDivida[element.status],
                saldo: element.saldo,
                contrato: element.contrato,
                userId: element.userId,
                propostas: element.propostas,
                propostaescolhida: element.propostaescolhida,
                forma_de_pagamento: element.forma_de_pagamento,
                estadocivil_envolvido: element.forma_de_pagamento,
                nacionalidade_envolvido: element.forma_de_pagamento, 
                rua_envolvido: element.forma_de_pagamento,
                numero_envolvido: element.forma_de_pagamento,
                 bairro_envolvido: element.forma_de_pagamento,
                 cidade_envolvido: element.forma_de_pagamento, 
                 uf_envolvido: element.forma_de_pagamento,
                 complemento_envolvido: element.forma_de_pagamento, 
                 cpf_envolvido: element.forma_de_pagamento, 
                 nome_envolvido: element.forma_de_pagamento,
                        
                    };
                });
                const user2 = await userModel
                .findOne({ cpf_cnpj: cpf })
                return res.status(200).json({
                    token,
                    user:user2,
                    dividas: div,
                });
            }
        } catch (error: any) {
            if (error.message === 'Usuário ou senha incorretos') {
                return res
                    .status(401)
                    .json({ message: 'Usuário ou senha incorretos' });
            }
            console.log(error);
            return res.status(400).json({ error });
        }
    }
}

export default LoginController;
