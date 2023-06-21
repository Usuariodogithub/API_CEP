import { response } from "express";

describe('CEP API', ()=>{
    beforeEach(()=>{
        cy.request('POST', '/ceps',{
            cep: '99999-888',
            logradouro: 'ENDEREÇO REFERENTE AO CEP'
        });
    });
    it('Deve salvar um CEP com dados válidos', ()=>{
        cy.request('POST', '/ceps',{
            cep:'11111-111',
            logradouro: 'ENDEREÇO TESTE'
        }).then((response)=>{
            expect(response.status).to.eq(201);
            expect(response.body).to.have.property('mensagem', 'CEP cadastrado com sucesso');
           
        });
    });
   it('não deve salvar um CEP com número de CEP inválido',() =>{
    cy.request({
        method: 'POST',
        url: '/ceps',
        failOnStatusCode: false,
        body:{
            cep:'',
            logradouro: 'ENDEREÇO TESTE'
             }
            }).then((response)=>{
                expect(response.status).to.eq(400);
                expect(response.body).to.have.property('MensagemDeErro')
                .and.to.be.an('array').that.includes('Númerode CEP ou Logradouro inválido');
                
            });
        });
        it('deve recuperar o logradouro de um CEP previamente cadastrado', ()=>{
            cy.request('GET', '/ceps/busca/cep/99999-999').then((response)=>{
                expect(response.status).to.eq(200);
                expect(response.body).to.have.property('endereço');
                expect(response.body.endereço).to.have.property('cep', '99999-999');
                expect(response.body.endereço).to.have.property('logradouro', 'ENDEREÇO REFENTE AO CEP');

            });
        });
        it('deve retornar mensagem de não encontrado para um CEP não cadastrado',()=>{
            cy.request({
                method: 'GET',
                url:'/ceps/busca/cep/00000-000',
                failOnStatusCode: false
                }).then((response)=>{
                    expect(response.status).to.eq(404);
                    expect(response.body).to.have.property('mensagem', 'Logradouro não encontrado ');

                });
        });
        it('não deve recuperar o logradouro de um CEP com formato inválido ',()=>{
            cy.request({
                method: 'GET',
                    url: '/ceps/busca/cep/123456789',
                    failOnStatusCode:false
            }).then((response)=>{
                expect(response.status).to.eq(400);
                expect(response.body).to.have.property('mensagem', 'CEP inválido');

            });
        });
        it('deve reculperar o CEP de um logradouro previamente cadastrado ',()=>{
            cy.request('GET', '/ceps/busca/logradouro/ENDEREÇO REFERENTE AO CEP').then((response)=>{
                expect(response.status).to.eq(200);
                expect(response.body).to.have.property('endereço ');
                expect(response.body.endereço).to.have.property('cep', '99999-999');
                expect(response.body.endereço).to.have.property('logradouro','ENDEREÇO REFERENTE AO CEP');

            });
        });
        it('deve retornar mensagem de não encontrado para logradouro não previamente cadastrado')
        cy.request({
            method:'GET',
            url:'/ceps/busca/logradouro/ENDEREÇO INEXISTENTE',
            failOnStatusCode:false
        }).then((response)=>{
            expect(response.status).to.eq(404);
            expect(response.body).to.have.property('mensagem', 'CEP não encontrado');
        });        
   });
});
