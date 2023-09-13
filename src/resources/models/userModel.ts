import { Schema, model } from 'mongoose';
import User from '@/utils/interfaces/userInterface';

const UserSchema = new Schema(
    {
        // User: Nome, CPF, Data de nascimento, Celular, Email, Senha, Lembrete(quer receber mensagem?SMS,email
        nome: { type: String, require: true },
        email: { type: String, require: true },
        senha: { type: String, require: true, select: false },
        cpf_cnpj: { type: String, require: true },
        celular: { type: String, require: true },
        receberatt: { type: Boolean, require: true },
        dataNascimento: {
            type: String,
            require: true,
        },
    },
    {
        timestamps: true,
    },
);

export default model<User>('User', UserSchema);
