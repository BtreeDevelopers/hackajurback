import Credor from '@/utils/interfaces/dividaInterface';
import { Schema, model } from 'mongoose';

const CredorSchema = new Schema(
    {
        nome: { type: String, require: true },

        status: { type: Number, require: true },
        saldo: { type: Number, require: true },
        contrato: { type: String, require: true },
        userId: { type: String, require: true },
        propostas: { type: [String], require: false },
        propostaescolhida: { type: String, require: false },
        forma_de_pagamento: { type: String, require: false },
        estadocivil_envolvido: { type: String, require: false },
        nacionalidade_envolvido: { type: String, require: false },
         rua_envolvido: { type: String, require: false },
         numero_envolvido: { type: String, require: false }, 
         bairro_envolvido: { type: String, require: false },
         cidade_envolvido: { type: String, require: false }, 
         uf_envolvido: { type: String, require: false },
         complemento_envolvido: { type: String, require: false }, 
         cpf_envolvido: { type: String, require: false }, 
         nome_envolvido: { type: String, require: false },

    },
    {
        timestamps: true,
    },
);

export default model<Credor>('Credor', CredorSchema);
