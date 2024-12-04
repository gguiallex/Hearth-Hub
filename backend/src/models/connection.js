const mysql = require('mysql2/promise'); // Importa o módulo mysql2/promise para trabalhar com conexões assíncronas ao banco de dados MySQL

// Carrega as variáveis de ambiente definidas no arquivo .env para uso no projeto
require('dotenv').config();

// Cria um pool de conexões com o MySQL usando as variáveis de ambiente
const connection = mysql.createPool({
    host: process.env.MYSQL_HOST, // Host onde o banco de dados está hospedado (definido em .env)
    port: process.env.MYSQL_PORT, // Porta onde o banco de dados está sendo executado (definida em .env)
    user: process.env.MYSQL_USER, // Usuário para se conectar ao banco de dados (definido em .env)
    password: process.env.MYSQL_PASSWORD, // Senha para autenticação no banco de dados (definida em .env)
    database: process.env.MYSQL_DB, // Nome do banco de dados a ser usado (definido em .env)
    waitForConnections: true, // Configuração para aguardar por novas conexões se todas estiverem ocupadas
    connectionLimit: 10, // Limite máximo de conexões simultâneas permitidas no pool
    queueLimit: 0,  // Limite de solicitações em fila quando o pool atinge o máximo de conexões (0 = sem limite)
    ssl: { rejectUnauthorized: false }, // Configuração para ignorar validação de certificado SSL (útil para ambientes de desenvolvimento)
});

// Exporta o pool de conexões para ser utilizado em outras partes da aplicação
module.exports = connection;