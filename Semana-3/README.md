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


