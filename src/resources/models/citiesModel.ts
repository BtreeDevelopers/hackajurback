import City from '@/utils/interfaces/citiesInterface';
import { Schema, model } from 'mongoose';

const CitiesSchema = new Schema({
    nome: { type: String, require: true },
    uf: {
        sigla: {
            type: String,
            required: true,
        },
        nome: {
            type: String,
            required: true,
        },
    },
});

export default model<City>('Cities', CitiesSchema);
