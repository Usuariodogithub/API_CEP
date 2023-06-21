import express ,{Request,Response } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import mongoose, { isValidObjectId } from 'mongoose';
import {CepModel, ICep} from './models/Cep';

const app = express();
const PORT = 3000;
app.use(bodyParser.json());
app.use(cors());

/**
 * Conectar ao MongoDB
 */
mongoose.connect('mongodb://mongodb/cepdb',{

    useNewUrlParser: true,

    useUnifiedTopology: true,
}).then(()=>{
    console.log('Conectado ao MongoDB');
}).catch((error)=>{
    console.log('Erro ao conectar ao MongoDB:', error);
});

/**
 * definir o esquema do CEP
 */

const cepSchema = new mongoose.Schema<ICep>({
    cep:{type:String,required:true},
    logradouro:{type:String,required:true},
});
//Criar o modelo do cep

const Cep =mongoose.model<ICep>('Cep',cepSchema);

//Endpoint para cadastrar um CEP

app.post('/ceps',async (req:Request,res:Response)=>{
    const {cep,logradouro}=req.body;
    if(!cep ||!logradouro){
        return res.status(400).json({ mensagensDeErro:['Número de cep ou logradouro inválido']});

    }
    try{
        const newCep =new Cep({cep,logradouro});
        await newCep.save();
        
        res.status(201).json({mensagem: 'CEP cadastrado com sucesso'});
        }catch(error){
            console.log('Erro ao cadastrar o CEP:', error);
            res.status(500).json({mensagem:'Erro ao cadastrar o CEP'});  
    }
});
//Endepoint para buscar um CEP por CEP

app.get('/ceps/busca/cep/:cep', async(req:Request,res:Response)=>{
    const cep =req.params.cep;
    if(!isValidCepFormat(cep)){
        return res.status(400).json({ mensagem: 'CEP não encontrado'});
    }
    try{
        const foundCep =await Cep.findOne({ cep});
        if(!foundCep){
            return res.status(404).json({mesagem: 'Logradouro não encontrado'});
        }
        res.status(200).json({ endereco: foundCep});
        catch(error){
            console.log('Erro ao buscar o Cep',error);
            res.status(500).json({mensagem: 'Erro ao buscar o CeP'});
            
            //EndPoint para buscar um CEP por Logradouro
app.get('/ceps/busca/logradouro/:logradouro',async (req:Request,res:Response)=>{
    const logradouro = req.params.logradouro;
    if(!logradouro){
        return res.status(400).json({ mensagem:'Logradouro inválido'});
    }try{

        const foundCep = await Cep.findOne({logradouro:{$regex:new RegExp(`^${logradouro}$`,`i`)}});

        if(!foundCep){
            return res.status(404).json({mensagem:'CEP não encontrado'});
        }
        res.status(200).json({endereco: foundCep});

       }catch(error){
        console.log('Erro ao buscar o logradouro', err);
        res.status(500).json({mensabem: 'Erro ao buscar logradouro'});
         }});
         

       
         //função auxiliar para vereficar o formato do CEP
         function isValidCepFormat(cep:string):boolean{
            const cepRegex = /^[0-9]{5}-[0-9]{3}$/;
            return cepRegex.test(cep);
        }
        //Iniciar servidor
        app.listen(PORT,()=>{
            console.log('Servidor rodando em http://localhost:${PORT}');
        })
        }
   
    


