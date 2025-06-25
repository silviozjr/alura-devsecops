# Semana 3

## Atividade 1 - Criar imagem personalizada com Dockerfile

Rodar o seguinte comando no terminal para criar a imagem:
```
docker build -t minha-app .
```

Rodar este comando para subir um container baseado na imagem criada
```
docker run -p 3000:3000 minha-app
```

Acessando localhost:3000 na máquina host será exibida a página da aplicação de demonstração (definida em index.js), "Hello world!"



## Atividade 2 - Comunicar containers via rede nomeada

Criada rede com o comando 
```
docker network create minha-rede
```

Subir container mongo usando a rede criada
```
docker run -d --name meu-banco --network minha-rede mongo
```

Subir app (o mesmo da atividade 1) usando a mesma rede:
```
docker run -it --network minha-rede -e MONGO_URL=mongodb://meu-banco:27017 minha-app
```


Usando docker inspect [CONTAINER_ID] podemos ver que os dois containers estão utilizando a mesma rede:

Container "minha-app":
```
docker inspect e6f:

    [...]
    Networks": {
        "minha-rede": {
            [...]
            "IPAddress": "172.18.0.3",
        }
    }
```

Container "mongo":
```
docker inspect 2e38:

    [...]
    Networks": {
        "minha-rede": {
            [...]
            "IPAddress": "172.18.0.2",
        }
    }
```


## Atividade 3 - Orquestrar com Docker Compose

O arquivo docker-compose.yml define os serviços, volume e rede a serem criados e iniciados.

Nesta atividade foram usadas as imagens do mongodb e do app alura-books, que estão definidos na seção 'services' do docker-compose.

Também foi definida a rede 'minha-rede-bridge', usada pelos dois serviços, o que permite a comunicação entre eles.

Além disso, foi utilizado um volume para persistir os dados do banco mesmo quando o container for removido (ao subir outro container usando o mesmo volume, os dados anteriores ainda permanecem nele).

Poderiam ter sido definidas variáveis de ambiente com o seletor 'environment', porém não foi necessário neste cenário.


Para subir os serviços, rodar (no diretório onde está o arquivo docker-compose.yml):
```
docker compose up
```
Ao acessar localhost:3000, será exibida a págin inicial do app. Pode-se acessar localhost:3000/seed para popular o banco com alguns dados, e após isso voltar à página inicial para ver os novos dados.

Para parar a execução e remover os containers, rodar:
```
docker compose down
```


## Atividade 4 - Identificar riscos com STRIDE

Realize uma modelagem de ameaças usando a metodologia STRIDE em uma funcionalidade da sua aplicação

### Funcionalidade: Listagem/visualização do diário eletrônico

Trata-se de uma página de acesso público que lista os diários eletrônicos e permite o download do diário em pdf.

#### S - Spoofing (Falsificação de identidade)

Risco baixo, mas possível. Como a funcionalidade é pública e não exige autenticação, o risco de spoofing direto (alguém fingir ser outro usuário) é baixo. Apenas se houver rastreamento de IP, cabeçalho HTTP ou outros metadados, um atacante poderia forjar essas informações para parecer outro usuário ou sistema.

Quem se beneficiaria?
Atacantes que queiram mascarar sua identidade real, para evitar detecção.


#### T - Tampering (Manipulação de dados)

Existe risco. Se não houver validação adequada no backend, um atacante poderia tentar modificar parâmetros da requisição (como número do diário ou caminho do PDF) para acessar conteúdos que não deveriam estar disponíveis, como edições futuras ainda não publicadas ou arquivos internos.

Quem se beneficiaria?
Alguém tentando acessar ou expor informações não públicas.


#### R - Repudiation (Ações sem rastreabilidade)

Existe risco, pois a funcionalidade é pública e não requer autenticação, assim não há como rastrear ou comprovar quem acessou ou tentou acessar um conteúdo.
Por exemplo, se alguém baixar uma edição e depois alegar não ter feito isso, não há logs vinculados a um usuário específico.

Quem se beneficiaria?
Qualquer pessoa que deseje negar ter acessado ou baixado determinada edição.


#### I - Information Disclosure (Vazamento de informações)

Existe risco, se o sistema listar ou permitir o acesso a diários ainda não publicados oficialmente (por erro de configuração ou lógica de listagem), informações sensíveis poderiam vazar antes do tempo.

Quem se beneficiaria?
Qualquer pessoa interessada em obter informações antes da divulgação oficial.


#### D - Denial of Service (Interrupção do serviço)

Existe risco. Como o serviço é público, está sujeito a ataques de negação de serviço (DDoS). Isso pode tornar a listagem inacessível, prejudicando o acesso da população às publicações.

Quem se beneficiaria?
Pessoas interessadas em impedir o acesso à informação temporariamente.


#### E - Elevation of Privilege (Elevação de privilégio)

Risco baixo ou inexistente. Como não há autenticação ou permissões associadas à listagem, não há papéis a escalar nesta funcionalidade específica.
Pode ocorrer risco caso o endpoint público de listagem ajude a descobrir outros endpoints mais sensíveis. Nesse caso um atacante pode tentar descobrir e abusar desses para ganhar acesso privilegiado.

Quem se beneficiaria?
Atacantes tentando explorar outras brechas no sistema para obter mais acesso.