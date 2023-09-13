import { Document } from 'mongoose';

interface User extends Document {
    nome: string;
    email: string;
    senha: string;
    cpf_cnpj: string;
    celular: string;
    receberatt: boolean;
    dataNascimento: string;
}

export default User;
