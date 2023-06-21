import {Document, Model,model, Schema} from 'mongoose';
export interface ICep extends Document{
    cep: string;
    logradouro: string;
}

const cepSchema =new Schema <ICep>({
    cep: {type: String, required: true},
    logradouro:{ type:String, required:true},

});
export const CepModel :Model<ICep> =model<ICep>('Cep', cepSchema);