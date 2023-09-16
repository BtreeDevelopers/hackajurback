import { Document } from 'mongoose';

interface PaymentForm extends Document {
    divida_id: string;
    avalista: {
        nome: string,
        cpf: string
    },
    fiador:{
        nome: string,
        cpf: string
    },
    caucao: boolean,
    cartao: boolean,
    pix: boolean,
    boleto: boolean
}

export default PaymentForm;