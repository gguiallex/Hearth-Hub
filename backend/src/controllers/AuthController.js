require('dotenv').config();

const jwt = require('jsonwebtoken');
const jwtSecret = process.env.JWT_SECRET;
const authModel = require('../models/authModel');
const { enviarEmailRecuperacaoSenha, enviarEmailConfirmaçãoDeConta } = require('../services/EmailService');

const gerarTokenRecuperacaoSenha = async (req, res) => {
    const { email, Perfil } = req.body;

    try {

        if (!email || !Perfil) {
            return res.status(400).json({ message: 'Parâmetros inválidos' });
        }
        // Verificar se o email existe no sistema
        const usuario = await authModel.getUserByEmail(email, Perfil);
        if (!usuario) {
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }

        // Gerar token de recuperação de senha
        const token = jwt.sign({ email, Perfil }, jwtSecret, { expiresIn: '1h' });

        // Enviar o token por e-mail
        await enviarEmailRecuperacaoSenha(email, token);

        res.status(200).json({ message: 'Token de recuperação de senha gerado com sucesso' });
    } catch (error) {
        console.error('Erro ao gerar token de recuperação de senha:', error);
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
};

const redefinirSenhaPeloLink = async (req, res) => {
    const { token, novaSenha } = req.body; // Agora espera os parâmetros no corpo da solicitação

    try {
        // Decodificar o token
        const decodedToken = jwt.verify(token, jwtSecret);
        const { email, Perfil } = decodedToken;

        // Verificar se o token é válido para este usuário
        const usuario = await authModel.getUserByEmail(email, Perfil);
        if (!usuario) {
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }

        // Atualizar a senha do usuário no banco de dados
        await authModel.atualizarSenha(email, novaSenha, Perfil);

        res.status(200).json({ message: 'Senha redefinida com sucesso' });
    } catch (error) {
        console.error('Erro ao redefinir senha pelo link:', error);
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
};

const gerarTokenConfirmaçãoDeConta = async (req, res) => {
    const {email} = req.body;

    try{
        if(!email){
            return res.status(400).json({ message: 'Parâmetros inválidos '});
        }
        //gerar token de confirmação de conta
        const token = jwt.sign({email}, jwtSecret, { expiresIn: '1h' });

        await enviarEmailConfirmaçãoDeConta(email, token);

        res.status(200).json({ message: 'Token de confirmação de conta gerado com sucesso'});
    } catch (error) {
        console.error('Erro ao gerar token de confirmação de conta:', error);
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
}

const validarConta = async (req, res) => {
    const { token } = req.body;
    console.log(token);

    try {
        const decoded = jwt.verify(token, jwtSecret);
        const { email } = decoded;
        console.log(email);

        await authModel.validarConta(email);
        res.status(200).json({ message: 'Conta confirmada com sucesso!' });
    } catch (error) {
        console.error('Erro ao confirmar cadastro:', error);
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
};

const emailAprovado = async (req, res) => {

    const {Email, Nome} = req.body;
    console.log(Email);
    console.log(Nome);
    const enviado = await authModel.emailContaAprovada(Email, Nome);

    return res.status(201).json(enviado);
}

const autenticar = async (req, res) => {
    const { email, senha } = req.body;

    try {
        const user = await authModel.autenticar(email, senha);

        if (user) {
            const { Nome, Perfil, Situação } = user;
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

module.exports = { autenticar, gerarTokenRecuperacaoSenha, redefinirSenhaPeloLink, gerarTokenConfirmaçãoDeConta, emailAprovado, validarConta };