require('dotenv').config(); // Carrega variáveis de ambiente do arquivo .env

const jwt = require('jsonwebtoken'); // Importa a biblioteca JWT para gerar e verificar tokens
const jwtSecret = process.env.JWT_SECRET; // Obtém a chave secreta do JWT a partir das variáveis de ambiente
const authModel = require('../models/authModel'); // Importa o modelo de autenticação
const { enviarEmailRecuperacaoSenha, enviarEmailConfirmaçãoDeConta } = require('../services/EmailService'); // Importa serviços de envio de e-mails

// Gera o Token para a rerecuperação da senha
const gerarTokenRecuperacaoSenha = async (req, res) => {
    const { email, Perfil } = req.body;

    try {
        // Valida se o email e o perfil estão presentes
        if (!email || !Perfil) {
            return res.status(400).json({ message: 'Parâmetros inválidos' });
        }
        // Verificar se o email existe no sistema
        const usuario = await authModel.getUserByEmail(email, Perfil);
        if (!usuario) {
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }

        // Gera um token JWT válido por 1 hora
        const token = jwt.sign({ email, Perfil }, jwtSecret, { expiresIn: '1h' });

        // Envia o token por e-mail para o usuário
        await enviarEmailRecuperacaoSenha(email, token);

        res.status(200).json({ message: 'Token de recuperação de senha gerado com sucesso' });
    } catch (error) {
        console.error('Erro ao gerar token de recuperação de senha:', error);
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
};

//Controlador da redefinição de senha pelo link
const redefinirSenhaPeloLink = async (req, res) => {
    const { token, novaSenha } = req.body; // Agora espera os parâmetros no corpo da solicitação

    try {
        // Verifica o token JWT recebido
        const decodedToken = jwt.verify(token, jwtSecret);
        const { email, Perfil } = decodedToken;

        // Verifica se o usuário existe no banco de dados
        const usuario = await authModel.getUserByEmail(email, Perfil);
        if (!usuario) {
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }

        // Atualizar a senha do usuário
        await authModel.atualizarSenha(email, novaSenha, Perfil);

        res.status(200).json({ message: 'Senha redefinida com sucesso' });
    } catch (error) {
        console.error('Erro ao redefinir senha pelo link:', error);
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
};

// Gera o Token de confirmação de conta(paciente)
const gerarTokenConfirmaçãoDeConta = async (req, res) => {
    const {email} = req.body;

    try{
        // Valida se o email está presente
        if(!email){
            return res.status(400).json({ message: 'Parâmetros inválidos '});
        }
        // Gera um token JWT para confirmação de conta
        const token = jwt.sign({email}, jwtSecret, { expiresIn: '1h' });

        // Envia o token por e-mail para o usuário
        await enviarEmailConfirmaçãoDeConta(email, token);

        res.status(200).json({ message: 'Token de confirmação de conta gerado com sucesso'});
    } catch (error) {
        console.error('Erro ao gerar token de confirmação de conta:', error);
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
}

// Valida a conta do usuário(paciente)
const validarConta = async (req, res) => {
    const { token } = req.body;
    console.log(token);

    try {
        // Decodifica o token JWT
        const decoded = jwt.verify(token, jwtSecret);
        const { email } = decoded;
        console.log(email);

        // Marca a conta do usuário como validada
        await authModel.validarConta(email);
        res.status(200).json({ message: 'Conta confirmada com sucesso!' });
    } catch (error) {
        console.error('Erro ao confirmar cadastro:', error);
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
};

// Notificação de conta aprovada
const emailAprovado = async (req, res) => {

    // Envia e-mail informando que a conta foi aprovada
    const {Email, Nome} = req.body;
    const enviado = await authModel.emailContaAprovada(Email, Nome);

    return res.status(201).json(enviado);
}

// Autenticação dos usuários
const autenticar = async (req, res) => {
    const { email, senha } = req.body;

    try {
        // Autentica o usuário no banco de dados
        const user = await authModel.autenticar(email, senha);

        if (user) {
            const { Nome, Perfil, Situação } = user;
            // Gera um token JWT com as informações do usuário
            const token = jwt.sign({ 
                nome: Nome, 
                perfil: Perfil, 
                situação: Situação, 
                ...(Perfil === 'M' && { crm: user.CRM }), 
                ...(Perfil === 'E' && { coren: user.COREN }) 
            }, jwtSecret);

            res.json({ 
                token, 
                nome: Nome, 
                perfil: Perfil, 
                situação: Situação, 
                ...(Perfil === 'M' && { crm: user.CRM }), 
                ...(Perfil === 'E' && { coren: user.COREN }) 
            });
        } else {
            res.status(401).json({ message: 'Credenciais inválidas' });
        }
    } catch (error) {
        console.error('Erro ao autenticar:', error);
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
};

// Exporta as funções para uso nas rotas
module.exports = { autenticar, gerarTokenRecuperacaoSenha, redefinirSenhaPeloLink, gerarTokenConfirmaçãoDeConta, emailAprovado, validarConta };