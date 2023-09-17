import { Document, Number } from 'mongoose';

interface Divida extends Document {
    nome: string;
    status: number;
    saldo: Number;
    contrato: string;
    userId: string;
    propostas: Array<string>;
    propostaescolhida: string;
    forma_de_pagamento: string;
    estadocivil_envolvido: string;
    nacionalidade_envolvido: string;
    rua_envolvido: string;
    numero_envolvido: string;
    bairro_envolvido: string;
    cidade_envolvido: string;
    uf_envolvido: string;
    complemento_envolvido: string; 
    cpf_envolvido: string;
    nome_envolvido: string;
    vencimento: string;
}

export default Divida;
