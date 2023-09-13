import { Document } from 'mongoose';

interface User extends Document {
    nome: string;
    email: string;
    senha: string;
    cpf_cnpj: string;
    celular: string;
    receberatt: boolean;
    dataNascimento: string;
    estadoCivil: string;
    cep: string;
    uf: string;
    cidade: string;
    bairro: string;
    rua: string;
    numero: string;
    tipo: string;
    complemento: string;
    assinatura: string;
    iniciais: string;
}

export default User;
