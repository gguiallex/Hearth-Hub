const connection = require('./connection.js');
const { enviarEmailAvisoAprovação } = require('../services/EmailService.js');

const getUserByEmail = async (email, Perfil) => {
    try {

        if (!email || !Perfil) {
            throw new Error('Parâmetros inválidos');
        }

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

        // Verificar se o email foi encontrado em alguma tabela
        const [result] = await connection.execute(`SELECT * FROM ${tabela} WHERE Email = ?`, [email]);
        return result.length > 0 ? result[0] : null;
    } catch (error) {
        console.error('Erro ao buscar usuário por email:', error);
        throw error;
    }
};

const autenticar = async (email, senha) => {
    const [adminResult] = await connection.execute('SELECT Nome, Perfil, Situação FROM administrador WHERE Email = ? AND Senha = ?', [email, senha]);
    if (adminResult.length > 0) {
        return adminResult[0];
    }

    const [medicoResult] = await connection.execute('SELECT Nome, CRM, Perfil, Situação FROM médicos WHERE Email = ? AND Senha = ?', [email, senha]);
    if (medicoResult.length > 0) {
        return medicoResult[0];
    }

    const [enfermeiroResult] = await connection.execute('SELECT Nome, COREN, Perfil, Situação FROM enfermeiros WHERE Email = ? AND Senha = ?', [email, senha]);
    if (enfermeiroResult.length > 0) {
        return enfermeiroResult[0];
    }

    const [pacienteResult] = await connection.execute('SELECT Nome, Perfil, Situação FROM pacientes WHERE Email = ? AND Senha = ?', [email, senha]);
    if (pacienteResult.length > 0) {
        return pacienteResult[0];
    }

    return null;
};

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

const validarConta = async (email) => {
    try {
        await connection.execute(`UPDATE pacientes SET Situação = ? WHERE Email = ?`, ['Validado', email]);
    } catch (error) {
        console.error('Erro ao confirmar cadastro:', error);
        throw error;
    }
};

const emailContaAprovada = async (Email, Nome) => {

    if (!Email || !Nome) {
        throw new Error('Email e Nome são obrigatórios');
    }

    await enviarEmailAvisoAprovação(Email, Nome);
    return { Email, Nome };
};

module.exports = { autenticar, getUserByEmail, atualizarSenha, validarConta, emailContaAprovada };