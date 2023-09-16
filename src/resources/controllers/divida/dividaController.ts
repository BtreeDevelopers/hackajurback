import auth from '@/middleware/authMiddleware';
import dividaModel from '@/resources/models/dividaModel';
import credorModel from '@/resources/models/dividaModel';
import userModel from '@/resources/models/userModel';
import statusDivida from '@/utils/enum/statusDividaENUM';
import Controller from '@/utils/interfaces/controllerInterface';
import { outAxios } from '@/utils/outAxios/outAxios';
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
        this.router.get(`${this.path}/gerarcontratos/:id_divida`, auth, this.gerarContrato)
        this.router.post(`${this.path}/escolherproposta`,auth,this.escolherproposta);
        this.router.post(`${this.path}/envolvido`,auth,this.dadosEnvolvido)
    }
    private async createNewDivida(req: Request, res: Response): Promise<any> {
        try {
            const newDividaBody = z.object({
                nome: z.string().min(1),
                status: z.number(),
                saldo: z.number(),
                contrato: z.string(),
                userId: z.string(),
                propostas: z.array(z.string()),
                propostaescolhida: z.string(),
                forma_de_pagamento: z.string(),

                estadocivil_envolvido: z.string().optional(),
                nacionalidade_envolvido: z.string().optional(), 
                rua_envolvido: z.string().optional(),
                numero_envolvido: z.string().optional(),
                 bairro_envolvido: z.string().optional(),
                 cidade_envolvido: z.string().optional(), 
                 uf_envolvido: z.string().optional(),
                 complemento_envolvido: z.string().optional(),
                  cpf_envolvido: z.string().optional(), 
                  nome_envolvido: z.string().optional(),

            });

            const {
                nome,
                status,
                saldo,
                contrato,
                userId,
                propostas,
                propostaescolhida,
                forma_de_pagamento, estadocivil_envolvido,nacionalidade_envolvido, rua_envolvido,numero_envolvido, bairro_envolvido,cidade_envolvido, uf_envolvido,complemento_envolvido, cpf_envolvido, nome_envolvido
            } = newDividaBody.parse(req.body);

            const data = await dividaModel.create({
                nome,
                status,
                saldo,
                contrato,
                userId,
                propostas,
                propostaescolhida,
                forma_de_pagamento,
                estadocivil_envolvido,nacionalidade_envolvido, rua_envolvido,numero_envolvido, bairro_envolvido,cidade_envolvido, uf_envolvido,complemento_envolvido, cpf_envolvido, nome_envolvido
                
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

        return res.status(201).json({ dividas: div });
    }

    private async gerarContrato(req: Request, res: Response): Promise<any> {
        try {
            const divida = await dividaModel.findById(req.params.id_divida);
            if(!divida){
                throw new Error('Divida não encontrada');
            }
            const user = await userModel.findById(req.userId);
            if(!user){
                throw new Error('Usuario não encontrado');
            }
            const termos = await outAxios.post('/document/gear-confissao-de-divida', {
                valor: divida.saldo,
                porcentagem_desconto: Math.random(),
                qtd_parcela:5,
                isPJ: user.cpf_cnpj.length===14,
                user:{
                    nome:user.nome,
                    nacionalidade: user.nacionalidade,
                    estado_civil: user.estadoCivil,
                    rua: user.rua,
                    numero: user.numero,
                    bairro: user.bairro,
                    cidade: user.cidade,
                    uf: user.uf,
                    cpf:user.cpf_cnpj.length===14?user.cpf_representado:'',
                    nome_empresa:user.cpf_cnpj.length===14 ? user.nome_empresa:'',
                    pj_direito: user.cpf_cnpj.length===14 ?? user.pj_direito,
                    cnpj:user.cpf_cnpj.length===14 ?? user.cnpj
                },
            

            });
            await dividaModel.findByIdAndUpdate(divida._id,{
                propostas: termos.data.listUrls
            })
            const dividas = await dividaModel.findById(req.params.id_divida)
            
            return res.status(200).json({termos:dividas});

        } catch (error: any) {
            console.log(error)
            return res.status(401).json(error);
        }

    }
    private async escolherproposta(req: Request, res: Response): Promise<any> {
        try {
            const newDividaBody = z.object({
                tipo: z.string().min(1),
                dividaId: z.string(),

            });

            const {
                tipo,
                dividaId   } = newDividaBody.parse(req.body);
            await dividaModel.findByIdAndUpdate(dividaId,{propostaescolhida:tipo})
            return res.status(200).json({message:"salvo"});
        } catch (error:any) {
            return res.status(401).json(error);
            
        }
    }//
    private async dadosEnvolvido(req: Request, res: Response): Promise<any> {
        try {
            const newDividaBody = z.object({
                id_divida:z.string(),
  estadocivil_envolvido:z.string(),
  nacionalidade_envolvido:z.string(),
  complemento_envolvido:z.string(),
  rua_envolvido:z.string(),
  numero_envolvido:z.string(),
  bairro_envolvido:z.string(),
  cidade_envolvido:z.string(),
  uf_envolvido:z.string(),
  cpf_envolvido:z.string(),
   nome_envolvido:z.string(), 

            });

            const {
                id_divida,
                estadocivil_envolvido,nacionalidade_envolvido,
                complemento_envolvido,
                rua_envolvido,numero_envolvido, bairro_envolvido,
                cidade_envolvido, uf_envolvido, cpf_envolvido,
                 nome_envolvido   } = newDividaBody.parse(req.body);

                 const data = await dividaModel.findByIdAndUpdate(id_divida,{
                    estadocivil_envolvido,nacionalidade_envolvido,
                complemento_envolvido,
                rua_envolvido,numero_envolvido, bairro_envolvido,
                cidade_envolvido, uf_envolvido, cpf_envolvido,
                 nome_envolvido            });
                 return res.status(200).json({message:"Salvo"})

        } catch (error) {
            return res.status(401).json(error);
        }
    }

}

export default DividaController;
