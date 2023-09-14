import Credor from '@/utils/interfaces/dividaInterface';
import { Schema, model } from 'mongoose';

const CredorSchema = new Schema(
    {
        nome: { type: String, require: true },

        status: { type: Number, require: true },
        saldo: { type: Number, require: true },
        contrato: { type: String, require: true },
        userId: { type: String, require: true },
        termoconfissaodivida: { type: String, require: false },
        propostas: { type: [String], require: false },
        propostaescolhida: { type: String, require: false },
        forma_de_pagamento: { type: String, require: true },
    },
    {
        timestamps: true,
    },
);

export default model<Credor>('Credor', CredorSchema);
