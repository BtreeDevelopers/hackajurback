import Controller from '@/utils/interfaces/controllerInterface';
import userModel from '@/resources/models/userModel';

import { Router, Request, Response } from 'express';
import z, { string } from 'zod';
import { compare } from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import mongoose from 'mongoose';
import generateToken from '@/utils/Auth/jwt.auth';

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

                return res.status(200).json({
                    token,
                    user: {
                        _id: user._id,
                        nome: user.nome,
                        email: user.email,
                        cpf_cnpj: user.cpf_cnpj,
                        celular: user.celular,
                        receberatt: user.receberatt,
                        dataNascimento: user.dataNascimento,
                    },
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
