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
        estadoCivil: { type: String, require: false },
        cep: { type: String, require: false },
        uf: { type: String, require: false },
        cidade: { type: String, require: false },
        bairro: { type: String, require: false },
        rua: { type: String, require: false },
        numero: { type: String, require: false },
        tipo: { type: String, require: false },
        complemento: { type: String, require: false },
        assinatura: { type: String, require: false },
        iniciais: { type: String, require: false },
        fotoPerfil: { type: String, require: false },
    },
    {
        timestamps: true,
    },
);

export default model<User>('User', UserSchema);
