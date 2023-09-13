// {
//   "_id": {
//     "$oid": "64fcbe4316b74d10a2bfa4d0"
//   },
//   "nome": "Alta Floresta D'Oeste",
//   "uf": {
//     "sigla": "RO",
//     "nome": "Rondônia"
//   }
// }

import { Document } from 'mongoose';

interface City extends Document {
    nome: string;
    uf: {
        siga: string;
        nome: string;
    };
}

export default City;
