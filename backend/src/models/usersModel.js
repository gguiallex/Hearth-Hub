const connection = require('./connection.js'); // Importa a conexão com o banco de dados MySQL

// Importa funções de envio de e-mails para notificações
const { enviarEmailPessoasPendentes, enviarEmailContaCriada } = require('../services/EmailService');

// ====================== MÉDICOS ======================

// Obtém todos os médicos do banco de dados
const getAllMedicos = async () => {
    const medicos = await connection.execute('SELECT * FROM médicos');
    return medicos;
};

// Obtém um médico pelo CRM
const getMedicoByCRM = async (CRM) => {
    const [medico] = await connection.execute('SELECT * FROM médicos WHERE CRM = ?', [CRM]);
    return medico;
};

// Cria um novo médico no banco de dados
const createMedico = async (medico) => {
    const { CRM, Nome, Especialidade, Email, Senha } = medico;

    //verificar se o email já esta em uso
    const [existingUser] = await connection.execute('SELECT * FROM médicos WHERE Email = ?', [Email]);

    if (existingUser.length > 0) {
        throw new Error('Email já está em uso');
    }

    //verificar se o CRM já esta em uso
    const [existingUser2] = await connection.execute('SELECT * FROM médicos WHERE CRM = ?', [CRM]);

    if (existingUser2.length > 0) {
        throw new Error('CRM já está em uso');
    }

    // Verificar se a especialidade existe na tabela de especialidades
    const [especialidadeExists] = await connection.execute('SELECT Especialidade FROM especialidade WHERE Especialidade = ?', [Especialidade]);

    // Se a especialidade não existe, lançar um erro
    if (especialidadeExists.length === 0) {
        throw new Error('A especialidade fornecida não é válida.');
    }

    // Insere o médico no banco de dados com situação inicial 'Suspenso'
    const query = 'INSERT INTO médicos(CRM, Nome, Especialidade, Email, Senha, Perfil, Situação) VALUES (?, ?, ?, ?, ?, ?, ?)';
    const [createdMedico] = await connection.execute(query, [CRM, Nome, Especialidade, Email, Senha, 'M', 'Suspenso']);
    
    // Envia um e-mail informando a criação da conta
    await enviarEmailContaCriada(Email);

    // Notifica os administradores sobre a nova conta pendente
    const [admins] = await connection.execute('SELECT Email FROM administrador');
    const adminEmails = admins.map(admin => admin.Email);
    for(const adminEmail of adminEmails) {
        await enviarEmailPessoasPendentes(adminEmail);
    }

    return { createdMedico };
};

// Atualiza um médico pelo CRM
const updateMedico = async (CRM, medico) => {

    const { Nome, Especialidade, Email, Senha, Situação } = medico;

    const query = 'UPDATE médicos set CRM = ?, Nome = ?, Especialidade = ?, Email = ?, Senha = ?, Situação = ? WHERE CRM = ?';

    const [updatedMedico] = await connection.execute(query, [CRM, Nome, Especialidade, Email, Senha, Situação, CRM]);
    return updatedMedico;
};

// Deleta um médico pelo CRM
const deleteMedico = async (CRM) => {
    const [removedMedico] = await connection.execute('DELETE FROM médicos where CRM = ?', [CRM]);
    return removedMedico;
}

// ====================== ENFERMEIROS ======================

// Obtém todos os enfermeiros do banco de dados
const getAllEnfermeiros = async () => {
    const enfermeiros = await connection.execute('SELECT * FROM enfermeiros');
    return enfermeiros;
};

// Obtém um enfermeiro pelo COREN
const getEnfermeiroByCOREN = async (COREN) => {
    const [enfermeiro] = await connection.execute('SELECT * FROM enfermeiros WHERE COREN = ?', [COREN]);
    return enfermeiro;
}

// Cria um novo enfermeiro no banco de dados
const createEnfermeiro = async (enfermeiro) => {
    const { COREN, Nome, Email, Senha } = enfermeiro;

    //verificar se o email já esta em uso
    const [existingUser] = await connection.execute('SELECT * FROM enfermeiros WHERE Email = ?', [Email]);

    if (existingUser.length > 0) {
        throw new Error('Email já está em uso');
    }

    //verificar se o COREN já esta em uso
    const [existingUser2] = await connection.execute('SELECT * FROM enfermeiros WHERE COREN = ?', [COREN]);

    if (existingUser2.length > 0) {
        throw new Error('COREN já está em uso');
    }

    const query = 'INSERT INTO enfermeiros(COREN, Nome, Email, Senha, Perfil, Situação) VALUES (?, ?, ?, ?, ?, ?)';

    const [createdEnfermeiro] = await connection.execute(query, [COREN, Nome, Email, Senha, 'E', 'Suspenso']);

    await enviarEmailContaCriada(Email);

    // Notifica os administradores
    const [admins] = await connection.execute('SELECT Email FROM administrador');
    const adminEmails = admins.map(admin => admin.Email);
    for(const adminEmail of adminEmails) {
        await enviarEmailPessoasPendentes(adminEmail);
    }

    return { createdEnfermeiro };
};

// Atualiza um enfermeiro pelo COREN
const updateEnfermeiro = async (COREN, enfermeiro) => {

    const { Nome, Email, Senha, Situação } = enfermeiro;

    const query = 'UPDATE enfermeiros set COREN = ?, Nome = ?, Email = ?, Senha = ?, Situação = ? WHERE COREN = ?';

    const [updatedEnfermeiro] = await connection.execute(query, [COREN, Nome, Email, Senha, Situação, COREN]);
    return updatedEnfermeiro;
};

// Deleta um enfermeiro pelo COREN
const deleteEnfermeiro = async (COREN) => {
    const [removedEnfermeiro] = await connection.execute('DELETE FROM enfermeiros where COREN = ?', [COREN]);
    return removedEnfermeiro;
}

// ====================== PACIENTES ======================

// Obtém todos os pacientes
const getAllPacientes = async () => {
    const pacientes = await connection.execute('SELECT * FROM pacientes');
    return pacientes;
};

// Obtém um paciente pelo email
const getPacienteByEmail = async (Email) => {
    const [paciente] = await connection.execute('SELECT * FROM pacientes WHERE Email = ?', [Email]);
    return paciente;
};

// Cria um novo paciente
const createPaciente = async (paciente) => {
    const { CPF, Nome, Email, Senha } = paciente;

    //verificar se o email já esta em uso
    const [existingUser] = await connection.execute('SELECT * FROM pacientes WHERE Email = ?', [Email]);

    if (existingUser.length > 0) {
        throw new Error('Email já está em uso');
    }

    //verificar se o CPF já esta em uso
    const [existingUser2] = await connection.execute('SELECT * FROM pacientes WHERE CPF = ?', [CPF]);

    if (existingUser2.length > 0) {
        throw new Error('CPF já está em uso');
    }

    const query = 'INSERT INTO pacientes(CPF, Nome, Email, Senha, Perfil, Situação) VALUES (?, ?, ?, ?, ?, ?)';

    const [createdPaciente] = await connection.execute(query, [CPF, Nome, Email, Senha, 'P', 'Suspenso']);
    return { createdPaciente };
};

// Atualiza um paciente pelo Email
const updatePaciente = async (Email, paciente) => {

    const { Nome, CPF, Senha, Situação } = paciente;

    const query = 'UPDATE pacientes set CPF = ?, Nome = ?, Email = ?, Senha = ?, Situação = ? WHERE Email = ?';

    const [updatedPaciente] = await connection.execute(query, [CPF, Nome, Email, Senha, Situação, Email]);
    return updatedPaciente;
};

// Deleta um paciente pelo email
const deletePaciente = async (Email) => {
    const [removedPaciente] = await connection.execute('DELETE FROM pacientes where Email = ?', [Email]);
    return removedPaciente;
}

// ====================== ADMINISTRADORES ======================

// Obtém todos os administradores
const getAllAdministradores = async () => {
    const administradores = await connection.execute('SELECT * FROM administrador');
    return administradores;
};

// Obtém um administrador pelo email
const getAdministradorByEmail = async (Email) => {
    const [admin] = await connection.execute('SELECT * FROM administrador WHERE Email = ?', [Email]);
    return admin;
};

// Cria um novo administrador
const createAdministrador = async (administrador) => {
    const { CPF, Nome, Email, Senha } = administrador;

    //verificar se o email já esta em uso
    const [existingUser] = await connection.execute('SELECT * FROM administrador WHERE Email = ?', [Email]);

    if (existingUser.length > 0) {
        throw new Error('Email já está em uso');
    }

    //verificar se o CPF já esta em uso
    const [existingUser2] = await connection.execute('SELECT * FROM administrador WHERE CPF = ?', [CPF]);

    if (existingUser2.length > 0) {
        throw new Error('CPF já está em uso');
    }

    const query = 'INSERT INTO administrador(CPF, Nome, Email, Senha, Perfil, Situação) VALUES (?, ?, ?, ?, ?, ?)';

    const [createdAdministrador] = await connection.execute(query, [CPF, Nome, Email, Senha, 'A', 'Suspenso']);

    await enviarEmailContaCriada(Email);
    
    const [admins] = await connection.execute('SELECT Email FROM administrador');
    const adminEmails = admins.map(admin => admin.Email);

    for(const adminEmail of adminEmails) {
        await enviarEmailPessoasPendentes(adminEmail);
    }

    return { createdAdministrador };
};

// Atualiza um administrador pelo email
const updateAdministrador = async (Email, administrador) => {

    const { Nome, CPF, Senha, Situação } = administrador;

    const query = 'UPDATE administrador set CPF = ?, Nome = ?, Email = ?, Senha = ?, Situação = ? WHERE Email = ?';

    const [updatedAdministrador] = await connection.execute(query, [CPF, Nome, Email, Senha, Situação, Email]);
    return updatedAdministrador;
};

// Deleta um administrador pelo email
const deleteAdministrador = async (Email) => {
    const [removedAdministrador] = await connection.execute('DELETE FROM administrador where Email = ?', [Email]);
    return removedAdministrador;
}

// Exporta todas as funções
module.exports = {
    getAllMedicos,
    getMedicoByCRM,
    createMedico,
    updateMedico,
    deleteMedico,
    getAllEnfermeiros,
    getEnfermeiroByCOREN,
    createEnfermeiro,
    updateEnfermeiro,
    deleteEnfermeiro,
    getAllPacientes,
    getPacienteByEmail,
    createPaciente,
    updatePaciente,
    deletePaciente,
    getAllAdministradores,
    getAdministradorByEmail,
    createAdministrador,
    updateAdministrador,
    deleteAdministrador
};
