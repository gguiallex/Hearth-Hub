const nodemailer = require('nodemailer'); // Importa o módulo nodemailer para envio de e-mails

// Variáveis de ambiente para o usuário e senha do e-mail de suporte
const USER = process.env.SUPPORT_USER; // Usuário do e-mail de suporte
const PASS = process.env.SUPPORT_PASS; // Senha do e-mail de suporte

// Configura o transporte para envio de e-mails usando o serviço SMTP do Outlook
const transport = nodemailer.createTransport({
    host: 'smtp-mail.outlook.com', // Servidor SMTP do Outlook
    port: 587, // Porta para conexões seguras (STARTTLS)
    secure: false, // 'true' para porta 465 (SSL) e 'false' para 587 (STARTTLS)
    auth: {
        user: USER, // E-mail de suporte
        pass: PASS, // Senha do e-mail de suporte
    }
});

// Função para enviar e-mail de recuperação de senha
const enviarEmailRecuperacaoSenha = async (destinatario, token) => {
    try {
        const info = await transport.sendMail({
            from: `HealthHub <${USER}>`, // Remetente
            to: destinatario, // Destinatário
            subject: 'Recuperação de senha', // Assunto do e-mail
            html: `                <h1>Olá!</h1>
                <p>Recebemos uma solicitação para redefinir a senha da sua conta no HealthHub.</p>
                <p>Se você solicitou essa alteração, clique no link abaixo para redefinir sua senha:</p>
                <p><a href="http://hearth-hub-frontend.vercel.app/redefinir-senha?token=${token}&email=${destinatario}" style="background-color: #4CAF50; color: white; padding: 12px 20px; text-align: center; text-decoration: none; display: inline-block; border-radius: 4px;">REDEFINIR SENHA</a></p>
                <p>Se você não solicitou essa alteração, ignore este email. Sua conta está segura.</p>
                <p>Atenciosamente,<br>Equipe HealthHub</p>` 
        });
        console.log('Email de recuperação de senha enviado: ', info.messageId);
    }catch (error){
        console.error('Erro ao enviar email de recuperação de senha: ', error);
    }
}

// Função para enviar e-mail de confirmação de conta
const enviarEmailConfirmaçãoDeConta = async (destinatario, token) => {
    try {
        const info = await transport.sendMail({
            from: `HealthHub <${USER}>`,
            to: destinatario,
            subject: 'Confirmação de conta',
            html:`<h1>Olá!</h1>
                <p>Bem-vindo ao HealthHub!</p>
                <p>Para confirmar o seu cadastro, clique no link abaixo:</p>
                <p><a href="http://hearth-hub-frontend.vercel.app/login?token=${token}&email=${destinatario}" style="background-color: #4CAF50; color: white; padding: 12px 20px; text-align: center; text-decoration: none; display: inline-block; border-radius: 4px;">CONFIRMAR CONTA</a></p>
                <p>Se você não se cadastrou no HealthHub, ignore este email.</p>
                <p>Obrigado!</p>`
        });
        console.log('Email de confirmação de conta enviado: ', info.messageId);
    }catch (error){
        console.error('Erro ao enviar email de confirmação de conta: ', error);
    }
}

// Função para enviar e-mail de aprovação de conta
const enviarEmailAprovaçãoConfirmada = async (destinatario) => {
    try {
        const info = await transport.sendMail({
            from: `HealthHub <${USER}>`,
            to: destinatario,
            subject: 'Conta aprovada com sucesso!',
            html:       `<h1>Olá!</h1>
                <p>Bem-vindo ao HealthHub!</p>
                <p>Temos o prazer de informar que suas informações foram verificadas e você foi aprovado no nosso aplicativo!</p>
                <p><a href="http://hearth-hub-frontend.vercel.app/login" style="background-color: #4CAF50; color: white; padding: 12px 20px; text-align: center; text-decoration: none; display: inline-block; border-radius: 4px;">FAÇA SEU LOGIN AGORA</a></p>
                <p>Obrigado por se juntar a nós!</p>
                <p>Atenciosamente,</p>
                <p>A equipe do HealthHub</p>`
        });
        console.log('Email de aprovação enviado: ', info.messageId);
    }catch (error){
        console.error('Erro ao enviar email de aprovação de conta: ', error);
    }
}

// Função para enviar e-mail de pendências administrativas
const enviarEmailPessoasPendentes = async (destinatario) => {
    try {
        const info = await transport.sendMail({
            from: `HealthHub <${USER}>`,
            to: destinatario,
            subject: 'Você tem novos usuários para verificar!',
            html:       `<h1>Caro Administrador(a),</h1>
                <p>Temos novos usuários aguardando verificação em nosso sistema. Por favor, revise e registre os novos usuários o mais breve possível.</p>
                <p><a href="http://hearth-hub-frontend.vercel.app/login" style="background-color: #4CAF50; color: white; padding: 12px 20px; text-align: center; text-decoration: none; display: inline-block; border-radius: 4px;">Clique aqui para fazer o login</a></p>
                <p>Obrigado por sua atenção!</p>
                <p>Atenciosamente,</p>
                <p>A equipe do HealthHub</p>`
        });
        console.log('Email de pessoas pendentes enviado: ', info.messageId);
    }catch (error){
        console.error('Erro ao enviar email de pessoas pendentes: ', error);
    }
}

// Função para enviar e-mail de aviso de aprovação
const enviarEmailAvisoAprovação = async (destinatario, nome) => {
    try {
        const info = await transport.sendMail({
            from: `HealthHub <${USER}>`,
            to: destinatario,
            subject: 'Parabéns pela sua aprovação!',
            html:        `<h1>Caro(a) ${nome},</h1>
            <p>Temos o prazer de informar que sua conta foi aprovada e você agora pode acessar o nosso aplicativo!</p>
            <p><a href="http://hearth-hub-frontend.vercel.app/login" style="background-color: #4CAF50; color: white; padding: 12px 20px; text-align: center; text-decoration: none; display: inline-block; border-radius: 4px;">FAÇA SEU LOGIN AGORA</a></p>
            <p>Obrigado por se juntar a nós!</p>
            <p>Atenciosamente,</p>
            <p>A equipe do HealthHub</p>`
        });
        console.log('Email de aviso de aprovação enviado: ', info.messageId);
    }catch (error){
        console.error('Erro ao enviar email de aviso sobre aprovação: ', error);
    }
};

// Função para enviar e-mail de confirmação de conta e aguardamento de aprovação
const enviarEmailContaCriada = async (destinatario) => {
    try {
        const info = await transport.sendMail({
            from: `HealthHub <${USER}>`,
            to: destinatario,
            subject: 'Falta pouco para você fazer parte da nossa equipe!',
            html:        `<h1>Caro(a) Usuário(a),</h1>
            <p>Agradecemos por se registrar no nosso aplicativo. Sua conta foi recebida com sucesso e está atualmente aguardando aprovação por um de nossos administradores.</p>
            <p>Você receberá uma notificação por e-mail assim que sua conta for aprovada e estiver pronta para uso.</p>
            <p>Obrigado pela sua paciência!</p>
            <p>Atenciosamente,</p>
            <p>A equipe do HealthHub</p>`
        });
        console.log('Email de criação enviado: ', info.messageId);
    }catch (error){
        console.error('Erro ao enviar email de criação de conta: ', error);
    }
}

// Exporta as funções para serem utilizadas em outras partes da aplicação
module.exports = {
    enviarEmailRecuperacaoSenha,
    enviarEmailConfirmaçãoDeConta,
    enviarEmailAprovaçãoConfirmada,
    enviarEmailPessoasPendentes,
    enviarEmailAvisoAprovação,
    enviarEmailContaCriada
};