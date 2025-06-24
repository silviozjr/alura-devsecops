// 1. Importa o módulo 'http' nativo do Node.js
const http = require('http');

// 2. Define o endereço do host e a porta em que o servidor vai ouvir
const hostname = '0.0.0.0'; // localhost
const port = 3000;

// 3. Cria o servidor
// A função passada para createServer será executada toda vez que uma requisição for recebida
const server = http.createServer((req, res) => {
  // Configura o cabeçalho da resposta
  res.statusCode = 200; // Código de status HTTP 200 OK
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');

  // Envia a mensagem "Hello, World!" como corpo da resposta e finaliza
  res.end('Olá, Mundo! (Hello, World!)\n');
});

// 4. Inicia o servidor e o faz "escutar" na porta e host definidos
server.listen(port, hostname, () => {
  // Esta função é chamada quando o servidor está pronto e esperando por conexões
  console.log(`Servidor rodando em http://${hostname}:${port}/`);
});