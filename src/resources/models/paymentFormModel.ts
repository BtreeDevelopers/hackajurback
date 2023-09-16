import Payment from '@/utils/interfaces/paymentFormInterface';
import { Schema, model } from 'mongoose';

const paymenrFormSchema = new Schema(
    {
        divida_id: { type: String, require: true },
        avalista: {
            nome: { type: String, require: false },
            cpf: {type: String, require: false }
        },
        fiador: {
            nome: { type: String, require: false },
            cpf: {type: String, require: false }
        },
        caucao: { type: Boolean, require: false },
        cartao: { type: Boolean, require: false },
        pix: { type: Boolean, require: false },
        boleto: { type: Boolean, require: false },
    },
    {
        timestamps: true,
    },
);

export default model<Payment>('PaymentForm', paymenrFormSchema);