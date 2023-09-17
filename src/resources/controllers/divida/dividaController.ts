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
        this.router.post(`${this.path}/escolherproposta`, auth, this.escolherproposta);
        this.router.post(`${this.path}/envolvido`, auth, this.dadosEnvolvido)
        this.router.post(`${this.path}/sign`, auth, this.assinardocumento);
        //this.router.post(`${this.path}/signEnvolvido`, auth, this.assinardocumentoenvolvido);
        this.router.patch(`${this.path}`, auth, this.updateDivida);
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

                vencimento: z.string().optional(),

            });

            const {
                nome,
                status,
                saldo,
                contrato,
                userId,
                propostas,
                propostaescolhida,
                forma_de_pagamento,
                estadocivil_envolvido,
                nacionalidade_envolvido,
                rua_envolvido,
                numero_envolvido,
                bairro_envolvido,
                cidade_envolvido,
                uf_envolvido, complemento_envolvido, cpf_envolvido,
                nome_envolvido
                ,
                vencimento
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
                estadocivil_envolvido, nacionalidade_envolvido, rua_envolvido, numero_envolvido, bairro_envolvido, cidade_envolvido, uf_envolvido, complemento_envolvido, cpf_envolvido, nome_envolvido
                , vencimento
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
                vencimento: element.vencimento
            };
        });

        return res.status(201).json({ dividas: div });
    }

    private async gerarContrato(req: Request, res: Response): Promise<any> {
        try {
            const divida = await dividaModel.findById(req.params.id_divida);
            if (!divida) {
                throw new Error('Divida não encontrada');
            }
            const user = await userModel.findById(req.userId);
            if (!user) {
                throw new Error('Usuario não encontrado');
            }

            let desconto = (score: any, contrato: any) => {
                let scorelil = 0
                if (0 <= score && score <= 20) {
                    scorelil = 8
                } else {
                    if (21 <= score && score <= 40) {
                        scorelil = 10
                    } else {
                        if (41 <= score && score <= 60) {
                            scorelil = 15
                        } else {

                            if (score <= 61 && score <= 80
                            ) {
                                scorelil = 20
                            } else {
                                if (score <= 81 && score < 100
                                ) {
                                    scorelil = 25
                                }
                            }
                        }
                    }
                }

                let tx = 0;
                if (contrato == 'garantia_real') {
                    tx = 3
                }
                if (contrato == 'boleto') {
                    tx = 4
                }
                if (contrato == 'pix') {
                    tx = 5
                }
                if (contrato == 'cartao_debito') {
                    tx = 7
                }
                if (contrato == 'fiador') {
                    tx = 3
                }
                if (contrato == 'parcelamento_s_garantia') {
                    tx = 3
                }
                if (contrato == 'caucao') {
                    tx = 5
                }
                if (contrato == 'cartao_credito') {
                    tx = 7
                }


                return scorelil + tx

            }
            const nm = {
                is_pf: false,
                nome: "Thalys Ricardo",
                pj: "privado",
                cnpj: "12345678901234",
                nome_administrador: "Thalys",
                nacionalidade_administrador: "Brasileiro",
                estado_civil_administrador: "Solteiro",
                cpf_administrador: "12345678910",
                rua: "Rua Alecrim Dourado",
                numero_endereco: "20",
                bairro: "Centro",
                cidade: "Uberaba",
                uf: "MG",
                cep: "38081190",
                vencimento_divida: "2000-01-01",
                valor_divida: 1058,
                valor_desconto: 10,
                qtd_de_parcela: 5,
                numero_cartao_credito: 1234567890123456
            }

            const isPJ = user.cpf_cnpj.length === 14;

            const mm = {
                is_pf: isPJ,
                nome: isPJ ? user.nome_empresa : user.nome,
                pj: isPJ ? user.pj_direito : "''",
                cnpj: isPJ ? user.cnpj : "''",
                nome_administrador: user.nome || "''",
                nacionalidade_administrador: 'BRASILEIRO',
                estado_civil_administrador: user.estadoCivil,
                cpf_administrador: user.cpf_cnpj,
                rua: user.rua,
                numero_endereco: user.numero,
                bairro: user.bairro,
                cidade: user.cidade,
                uf: user.uf,
                cep: user.cep,
                vencimento_divida: divida.vencimento,
                valor_divida: divida.saldo,
                valor_desconto: desconto(user.score, divida.propostaescolhida),
                qtd_de_parcela: 5,
                numero_cartao_credito: 1111111111111111
            }
            console.log(mm)
            //let mmm = JSON.stringify(nm).replace('\"', "'")
            //console.log(mmm)

            const termos = await outAxios.post('/document/gerar-propostas', mm);


            await dividaModel.findByIdAndUpdate(divida._id, {
                propostas: termos.data.listUrls
            })
            const dividas = await dividaModel.findById(req.params.id_divida)

            return res.status(200).json({
                termos: dividas,
                garantia_real: desconto(user.score, 'garantia_real'),
                boleto: desconto(user.score, 'boleto'),
                pix: desconto(user.score, 'pix'),
                cartao_debito: desconto(user.score, 'cartao_debito'),
                fiador: desconto(user.score, 'fiador'),
                parcelamento_s_garantia: desconto(user.score, 'parcelamento_s_garantia'),
                caucao: desconto(user.score, 'caucao'),
                cartao_credito: desconto(user.score, 'cartao_credito'),
            });

        } catch (error: any) {
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
                dividaId } = newDividaBody.parse(req.body);
            await dividaModel.findByIdAndUpdate(dividaId, { propostaescolhida: tipo })
            return res.status(200).json({ message: "salvo" });
        } catch (error: any) {
            console.log('err', error)
            return res.status(401).json(error.response);

        }
    }//
    private async dadosEnvolvido(req: Request, res: Response): Promise<any> {
        try {
            const newDividaBody = z.object({
                id_divida: z.string(),
                estadocivil_envolvido: z.string(),
                nacionalidade_envolvido: z.string(),
                complemento_envolvido: z.string(),
                rua_envolvido: z.string(),
                numero_envolvido: z.string(),
                bairro_envolvido: z.string(),
                cidade_envolvido: z.string(),
                uf_envolvido: z.string(),
                cpf_envolvido: z.string(),
                nome_envolvido: z.string(),

            });

            const {
                id_divida,
                estadocivil_envolvido, nacionalidade_envolvido,
                complemento_envolvido,
                rua_envolvido, numero_envolvido, bairro_envolvido,
                cidade_envolvido, uf_envolvido, cpf_envolvido,
                nome_envolvido } = newDividaBody.parse(req.body);

            const data = await dividaModel.findByIdAndUpdate(id_divida, {
                estadocivil_envolvido, nacionalidade_envolvido,
                complemento_envolvido,
                rua_envolvido, numero_envolvido, bairro_envolvido,
                cidade_envolvido, uf_envolvido, cpf_envolvido,
                nome_envolvido
            });
            return res.status(200).json({ message: "Salvo" })

        } catch (error) {
            return res.status(401).json(error);
        }
    }//
    private async assinardocumento(req: Request, res: Response): Promise<any> {
        try {
            const divida = await dividaModel.findById(req.params.id_divida);
            if (!divida) {
                throw new Error('Divida não encontrada');
            }
            if (divida.propostaescolhida == "fiador") {
                throw new Error('Não é possivel realizar operação com fiador')
            }
            const user = await userModel.findById(req.userId);
            if (!user) {
                throw new Error('Usuario não encontrado');
            }

            const termos = await outAxios.post('/document/gear-confissao-de-divida', {
                tipo: divida.propostaescolhida,
                url_assinatura: user.assinatura,
                url_assinatura_envolvido: '',
                nome_envolvido: '',
                cpf_envolvido: '',
                email_envolvido: '',
                estadocivil_envolvido: '',
                nacionalidade_envolvido: '',
                complemento_envolvido: '',
                rua_envolvido: '',
                numero_envolvido: '',
                bairro_envolvido: '',
                cidade_envolvido: '',
                uf_envolvido: '',
                valor_divida: "",
                porcentagem_desconto: '',
                qtd_parcela: 5,
                isPJ: user.cpf_cnpj.length === 14 ? true : false,
                user: {
                    nome: user.nome,
                    nacionalidade: user.nacionalidade,
                    estado_civil: user.estadoCivil,
                    rua: user.rua,
                    numero: user.numero,
                    bairro: user.bairro,
                    cidade: user.cidade,
                    uf: user.uf,
                    complemento: user.complemento,
                    CPF: user.cpf_cnpj.length === 14 ? user.cpf_representado : '',
                    nome_empresa: user.nome_empresa,
                    pjdireito: user.pj_direito,
                    cnpj: user.cpf_cnpj.length === 14 ? user.cpf_cnpj : ''
                }

            });
            return res.status(200).json({ url_doc: termos.data.listUrls })

        } catch (error) {
            return res.status(500).json({ msg: 'assinado e aguardando envolvido' })
        }
    }
    /*
    private async assinardocumentoenvolvido(req: Request, res: Response): Promise<any> {
        try {
            const divida = await dividaModel.findById(req.params.id_divida);
            if (!divida) {
                throw new Error('Divida não encontrada');
            }
            const user = await userModel.findById(req.userId);
            if (!user) {
                throw new Error('Usuario não encontrado');
            }
            const termos = await outAxios.post('/document/gear-confissao-de-divida', {

                tipo: divida.propostaescolhida,
                url_assinatura: user.assinatura,
                url_assinatura_envolvido: '',
                nome_envolvido: '',
                estadocivil_envolvido: '',
                nacionalidade_envolvido: '',
                complemento_envolvido: '',
                rua_envolvido: '',
                numero_envolvido: '',
                bairro_envolvido: '',
                cidade_envolvido: '',
                uf_envolvido: '',
                cpf_envolvido: '',
                email_envolvido: '',
                email: '',
                valor_divida: '',
                porcentagem_desconto: (gerado, calculo com PH)
            qtd_parcela: 5(numero fixo),
                isPJ: usuario.cpf_cnpj.lenght === 14
            user: {
                nome, nacionalidade, estado civil, rua, numero, bairro, cidade, uf, complemento(do usuario)
                CPF: (caso PJ enviar -> cpf_representado)
                nome_empresa(caso PJ)
                  PJ de direito privado / publico(caso PJ)
                cnpj(caso PJ cpf_cnpj)
            }
        }

        });
} catch (error) {

}
*/



    private async updateDivida(req: Request, res: Response): Promise<any> {

    }
}





export default DividaController;
