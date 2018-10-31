-----------------------------------------------------
API de Cotação Real Time da CIV
-----------------------------------------------------

Como requerer:

Use o Postman;
url: https://apiciv.herokuapp.com/api/quotation
Tipo: POST
Insira no header uma key tipo "Content-Type" com value "application/json"
Insira um body: 
{
	"equiptOrder": 100,
    "latOrder": -14.5264886,
    "lonOrder": -48.5258429,
    "dtIn": "01-31-2018",
    "dtOut": "02-25-2018"
}

Onde "equiptOrder" é o ID do equipamento desejado, "latOrder" é a latitude do pedido, "lonOrder" é a longitude do pedido, "dtIn" é a data de entrega (formato MM-DD-AAAA) e "dtOut" é a data de devolução (formato MM-DD-AAAA).

Se:
1) "equiptOrder" não estiver disponível no DB, retorno:
{
    "error": "ID de equipamento não encontrado no DB."
}

2) "equiptOrder" não for encontrado em empresas com raio de atuação do "latOrder" e "lonOrder":
{
    "error": "Equipamento não disponível na região solicitada."
}

3) "dtIn" for maior que "dtOut":
{
    "error": "Data de devolução é menor ou igual a data de entrega"
}

4) "dtIn" ou "dtOut" for em fim de semana:
{
    "error": "Não é possível entregar ou retirar no final de semana"
}

4) "dtIn" ou "dtOut" for em feriado (mapa de feriados dos principais países está atualizado):
{
    "error": "Não é possível entregar ou retirar em feriados"
}

Retorno da API:
{
    "data": {
        "prices": {
            "owner": 10373.31,
            "full": 11747.51
        },
        "garages": [
            {
                "id": 5,
                "price": 7927.34
            },
            {
                "id": 3,
                "price": 12117.71
            },
            {
                "id": 1,
                "price": 11074.87
            }
        ]
    }
}

Onde /prices:
	/owner: Preço médio dos locadores que atendem a região;
	/full: Preço CIV aplicado no preço médio (Preço médio dos locadores + Comissão CIV + Repasse Moip + Impostos). O preço CIV é calculado considerando pagamento em cartão de crédito e alíquota CIV 8%
	
Onde /garages:
    /id: id da garagem considerada na composição da média
    /price: preço calculado para a garagem