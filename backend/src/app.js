const express = require('express'); // Importa o módulo Express para criar e configurar o servidor
const router = require('./router'); // Importa as rotas definidas no arquivo 'router.js'
const cors = require('cors'); // Importa o middleware CORS para permitir o acesso de diferentes origens

const app = express(); // Cria uma instância do Express

app.use(cors()); // Aplica o middleware CORS para habilitar o compartilhamento de recursos entre origens diferentes

app.use(express.json()); // Configura o Express para interpretar requisições com corpo no formato JSON
app.use(router); // Aplica as rotas definidas no arquivo 'router.js' ao aplicativo

module.exports = app; // Exporta a instância do aplicativo para ser usada em outros arquivos (como 'server.js')