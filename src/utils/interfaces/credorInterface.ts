import { Document } from 'mongoose';

interface Credor extends Document {
    nome: string;
    nacionalidade: string;
    estadocivil: string;
    profissao: string;
    domicílio: string;
    numeroRecidencia: string;
    bairro: string;
    cidade: string;
    estado: string;
    cep: string;
}

export default Credor;
