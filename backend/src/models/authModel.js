const connection = require('./connection.js'); // Importa a conexão com o banco de dados MySQL
const { enviarEmailAvisoAprovação } = require('../services/EmailService.js'); // Importa a função de envio de e-mail para avisar sobre a aprovação de conta

// Função para buscar um usuário no banco de dados pelo email e tipo de perfil
const getUserByEmail = async (email, Perfil) => {
    try {
        // Validação dos parâmetros obrigatórios
        if (!email || !Perfil) {
            throw new Error('Parâmetros inválidos');
        }
        // Determina a tabela com base no tipo de perfil (A: Administrador, M: Médico, P: Paciente, E: Enfermeiro)
        let tabela;
        switch (Perfil) {
            case 'A':
                tabela = 'administrador';
                break;
            case 'M':
                tabela = 'médicos';
                break;
            case 'P':
                tabela = 'pacientes';
                break;
            case 'E':
                tabela = 'enfermeiros';
                break;
            default:
                throw new Error('Tipo de conta inválido');
        }

        // Executa a consulta SQL para buscar o usuário pelo email
        const [result] = await connection.execute(`SELECT * FROM ${tabela} WHERE Email = ?`, [email]);
        // Retorna o usuário encontrado ou `null` se não houver resultado
        return result.length > 0 ? result[0] : null;
    } catch (error) {
        console.error('Erro ao buscar usuário por email:', error);
        throw error;
    }
};

// Função para autenticar um usuário com base no email e senha
const autenticar = async (email, senha) => {
    // Consulta para autenticação de administradores
    const [adminResult] = await connection.execute('SELECT Nome, Perfil, Situação FROM administrador WHERE Email = ? AND Senha = ?', [email, senha]);
    if (adminResult.length > 0) {
        return adminResult[0];
    }

    // Consulta para autenticação de médicos
    const [medicoResult] = await connection.execute('SELECT Nome, CRM, Perfil, Situação FROM médicos WHERE Email = ? AND Senha = ?', [email, senha]);
    if (medicoResult.length > 0) {
        return medicoResult[0];
    }

    // Consulta para autenticação de enfermeiros
    const [enfermeiroResult] = await connection.execute('SELECT Nome, COREN, Perfil, Situação FROM enfermeiros WHERE Email = ? AND Senha = ?', [email, senha]);
    if (enfermeiroResult.length > 0) {
        return enfermeiroResult[0];
    }

    // Consulta para autenticação de pacientes
    const [pacienteResult] = await connection.execute('SELECT Nome, Perfil, Situação FROM pacientes WHERE Email = ? AND Senha = ?', [email, senha]);
    if (pacienteResult.length > 0) {
        return pacienteResult[0];
    }

    // Retorna `null` se nenhuma consulta encontrar correspondência
    return null;
};

// Função para atualizar a senha de um usuário com base no tipo de perfil e email  
const atualizarSenha = async (email, novaSenha, tipo) => {
    try {
        let tabela;
        switch (tipo) {
            case 'A':
                tabela = 'administrador';
                break;
            case 'M':
                tabela = 'médicos';
                break;
            case 'P':
                tabela = 'pacientes';
                break;
            case 'E':
                tabela = 'enfermeiros';
                break;
            default:
                throw new Error('Tipo de usuário inválido');
        }
        //atualizar a senha do usuário no banco de dados
        await connection.execute(`UPDATE ${tabela} SET Senha = ? WHERE Email = ?`, [novaSenha, email]);
    } catch (error) {
        console.error('Erro ao atualizar senha:', error);
        throw error;
    }
};

// Função para validar a conta de um paciente pelo email
const validarConta = async (email) => {
    try {
        // Atualiza a situação do paciente para 'Validado' no banco de dados
        await connection.execute(`UPDATE pacientes SET Situação = ? WHERE Email = ?`, ['Validado', email]);
    } catch (error) {
        console.error('Erro ao confirmar cadastro:', error);
        throw error;
    }
};

// Função para enviar um e-mail de notificação quando a conta for aprovada
const emailContaAprovada = async (Email, Nome) => {

    if (!Email || !Nome) {
        throw new Error('Email e Nome são obrigatórios');
    }

    // Envia o e-mail usando o serviço de e-mails configurado
    await enviarEmailAvisoAprovação(Email, Nome);
    return { Email, Nome };
};

// Exporta as funções para serem usadas em outras partes da aplicação
module.exports = { autenticar, getUserByEmail, atualizarSenha, validarConta, emailContaAprovada };