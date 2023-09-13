import Credor from '@/utils/interfaces/credorInterface';
import { Schema, model } from 'mongoose';

const CredorSchema = new Schema(
    {
        nome: { type: String, require: true },
        nacionalidade: { type: String, require: true },
        estadocivil: { type: String, require: true, select: false },
        profissao: { type: String, require: true },
        domicílio: { type: String, require: true },
        numeroRecidencia: { type: String, require: true },
        bairro: {
            type: String,
            require: true,
        },
        cidade: { type: String, require: true },
        estado: { type: String, require: true },
        cep: { type: String, require: true },
    },
    {
        timestamps: true,
    },
);

export default model<Credor>('Credor', CredorSchema);
