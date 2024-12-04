const app = require('./app'); // Importa a configuração principal do aplicativo Express definida no arquivo 'app.js'
require('dotenv').config(); // Carrega variáveis de ambiente do arquivo .env para o process.env, usando a biblioteca dotenv

// Define a porta em que o servidor irá rodar, utilizando a variável de ambiente 'PORT'.
// Se 'PORT' não estiver definida, utiliza a porta 2222 como padrão.
const PORT = process.env.PORT || 2222;

// Inicia o servidor na porta especificada e exibe uma mensagem no console indicando que o servidor está rodando
app.listen(PORT, () => console.log(`Server running or port ${PORT}`));