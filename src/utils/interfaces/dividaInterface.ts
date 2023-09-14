import { Document, Number } from 'mongoose';

interface Divida extends Document {
    nome: string;
    status: number;
    saldo: Number;
    contrato: string;
    userId: string;
    termoconfissaodivida: string;
    propostas: Array<string>;
    propostaescolhida: string;
    forma_de_pagamento: string;
}

export default Divida;
