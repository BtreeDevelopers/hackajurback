import userModel from '@/resources/models/userModel';
import generateToken from '@/utils/Auth/jwt.auth';
import Controller from '@/utils/interfaces/controllerInterface';
import { Router, Request, Response } from 'express';
import z, { string } from 'zod';
import mongoose from 'mongoose';
import bcryptjs from 'bcryptjs';
import { compare } from 'bcryptjs';

import auth from '@/middleware/authMiddleware';
import Multer from '@/middleware/multerMiddleware';
import addImage from '@/utils/firebase/firebase';

class UserController implements Controller {
    public path = '/user';
    public router: Router;

    constructor() {
        this.router = Router();
    }

    public async initialiseRoutes(): Promise<void> {
        this.router.post(`${this.path}`, this.createNewUser);
        this.router.get(`${this.path}/users`, [auth], this.getAllUser);
        this.router.get(
            `${this.path}/users/:typeparam/:param`,
            [auth],
            this.getUserByParam,
        );
        this.router.patch(
            `${this.path}/editaccount`,
            auth,
            Multer.any(),
            addImage,
            this.editarConta,
        );
        this.router.post(`${this.path}/delete`, auth, this.deleteaccount);
    }

    private async createNewUser(req: Request, res: Response): Promise<any> {
        try {
            const newUserBody = z.object({
                nome: z.string().min(1),
                email: z.string().email(),
                senha: z.string(),
                cpf_cnpj: z.string(),
                celular: z.string(),
                receberatt: z.boolean(),
                dataNascimento: z.string(),
            });

            const {
                nome,
                email,
                senha,
                cpf_cnpj,
                celular,
                receberatt,
                dataNascimento,
            } = newUserBody.parse(req.body);

            const user = await userModel.findOne({ email });

            if (!user) {
                const hash = await bcryptjs.hash(senha, 10);
                const data = await userModel.create({
                    nome,
                    email,
                    senha: hash,
                    cpf_cnpj,
                    celular,
                    receberatt,
                    dataNascimento,
                    nacionalidade: 'BRASILEIRO',
                });

                return res.status(201).json({
                    data: { nome: data.nome, email: data.email, _id: data._id },
                });
            } else {
                return res.status(400).json({ message: 'usuário já criado' });
            }
        } catch (error: any) {
            return res.status(401).json(error);
        }
    }

    private async getAllUser(req: Request, res: Response): Promise<any> {
        try {
            const user = await userModel.find({});
            return res.status(201).json({ user });
        } catch (error) {
            return res.status(500).json({ message: 'Something went wrong' });
        }
    }

    private async getUserByParam(req: Request, res: Response): Promise<any> {
        try {
            if (
                !req.params.param ||
                req.params.param === '' ||
                !req.params.typeparam ||
                req.params.typeparam === ''
            ) {
                return res.status(500).json({ message: 'Missing Params' });
            }

            if (req.params.typeparam === 'id') {
                const user = await userModel.findById(req.params.param);
                return res.status(201).json({ user });
            }

            if (req.params.typeparam === 'email') {
                const user = await userModel.find({
                    email: req.params.param,
                });
                return res.status(201).json({ user });
            }

            if (req.params.typeparam === 'nome') {
                const user = await userModel.find({
                    nome: req.params.param,
                });
                return res.status(201).json({ user });
            }
        } catch (error) {
            return res.status(500).json({ message: 'Something went wrong' });
        }
    }

    private async editarConta(req: Request, res: Response): Promise<any> {
        const session = await mongoose.startSession();
        session.startTransaction();
        try {
            const firebaseUrl = (req.body as any)?.urls || [''];
            const editUserBody = z.object({
                userId: z.string(),
                estadoCivil: z.string().optional(),
                email: z.string().email().optional(),
                cep: z.string().optional(),
                uf: z.string().optional(),
                cidade: z.string().optional(),
                bairro: z.string().optional(),
                rua: z.string().optional(),
                numero: z.string().optional(),
                tipo: z.string().optional(),
                complemento: z.string().optional(),
            });
            const {
                userId,
                estadoCivil,
                email,
                cep,
                uf,
                cidade,
                bairro,
                rua,
                numero,
                tipo,
                complemento,
            } = editUserBody.parse(req.body);

            let iniciais = '';
            let assinatura = '';
            let fotoPerfil = '';

            firebaseUrl.forEach((element: { tipo: string; url: string }) => {
                if (element.tipo == 'iniciais') {
                    iniciais = element.url;
                }
                if (element.tipo == 'assinatura') {
                    assinatura = element.url;
                }
                if (element.tipo == 'fotoPerfil') {
                    fotoPerfil = element.url;
                }
            });

            const user = await userModel.findById(userId);
            if (!user) {
                throw new Error('User data not found');
            }
            const newuser = await userModel.findOneAndUpdate(
                { _id: userId },
                {
                    email: email || user.email,
                    estadoCivil: estadoCivil || user.estadoCivil,
                    cep: cep || user.cep,
                    uf: uf || user.uf,
                    cidade: cidade || user.cidade,
                    bairro: bairro || user.bairro,
                    rua: rua || user.rua,
                    numero: numero || user.numero,
                    tipo: tipo || user.tipo,
                    complemento: complemento || user.complemento,
                    iniciais: iniciais || user.iniciais,
                    assinatura: assinatura || user.assinatura,
                    fotoPerfil: fotoPerfil || user.fotoPerfil,
                },
            );

            await session.commitTransaction();
            return res
                .status(201)
                .json({ message: 'Update with success', user: newuser });
        } catch (error: any) {
            console.log(error);
            await session.abortTransaction();
            return res.status(500).json({ message: 'Something went wrong' });
        } finally {
            await session.endSession();
        }
    }
    private async deleteaccount(req: Request, res: Response): Promise<any> {
        const session = await mongoose.startSession();
        session.startTransaction();
        try {
            const deleteUserBody = z.object({
                userId: z.string(),
                senha: z.string(),
            });
            const { userId, senha } = deleteUserBody.parse(req.body);

            const user = await userModel.findById(userId).populate('senha');
            if (!user) throw new Error('Usuário ou senha incorretos');

            const passwordMatch = await compare(senha, user.senha);
            if (!passwordMatch) throw new Error('Senha não confere');

            await userModel.findOneAndDelete({ _id: userId });
            await session.commitTransaction();
            return res.status(200).json({ message: 'Delete with success' });
        } catch (error) {
            console.log(error);
            await session.abortTransaction();
            return res.status(500).json({ message: 'Something went wrong' });
        } finally {
            await session.endSession();
        }
    }
}

export default UserController;
