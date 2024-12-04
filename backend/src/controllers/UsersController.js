const usersModel = require('../models/usersModel'); // Importa o modelo responsável por interagir com o banco de dados relacionado aos usuários

// ====================== MÉDICOS ======================

// Retorna todos os médicos
const getAllMedicos = async (_req, res) => {

    const [medicos] = await usersModel.getAllMedicos();

    return res.status(200).json(medicos);
};

// Retorna um médico pelo CRM
const getMedicoByCRM = async (req, res) => {
    const CRM = req.params.CRM;

    try {
        const medico = await usersModel.getMedicoByCRM(CRM);
        console.log('Resultado da consulta:', medico.Nome);
        return res.status(200).json(medico);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Erro ao buscar médico por CRM' });
    }
};

// Cria um novo médico
const createMedico = async (req, res) => {
    const createdMedico = await usersModel.createMedico(req.body);

    return res.status(201).json(createdMedico);
}

// Atualiza um médico pelo CRM
const updateMedico = async (req, res) => {
    const {CRM} = req.params;

    const updatedMedico = await usersModel.updateMedico(CRM, req.body);
    return res.status(204).json(updatedMedico);
}

// Deleta um médico pelo CRM
const deleteMedico = async (req, res) => {
    const {CRM} = req.params;

    await usersModel.deleteMedico(CRM);
    return res.status(204).json();
}

// ====================== ENFERMEIROS ======================

// Retorna todos os enfermeiros
const getAllEnfermeiros = async (_req, res) => {

    const [enfermeiros] = await usersModel.getAllEnfermeiros();

    return res.status(200).json(enfermeiros);
};

// Retorna um enfermeiro pelo COREN
const getEnfermeiroByCOREN = async (req, res) => {
    const COREN = req.params.COREN;

    try {
        const enfermeiro = await usersModel.getEnfermeiroByCOREN(COREN);
        console.log('Resultado da consulta:', enfermeiro.Nome);
        return res.status(200).json(enfermeiro);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Erro ao buscar enfermeiro por COREN' });
    }
};

// Cria um novo enfermeiro
const createEnfermeiro = async (req, res) => {
    const createdEnfermeiro = await usersModel.createEnfermeiro(req.body);

    return res.status(201).json(createdEnfermeiro);
}

// Atualiza um enfermeiro pelo COREN
const updateEnfermeiro = async (req, res) => {
    const {COREN} = req.params;

    const updatedEnfermeiro = await usersModel.updateEnfermeiro(COREN, req.body);
    return res.status(204).json(updatedEnfermeiro);

}

// Deleta um enfermeiro pelo COREN
const deleteEnfermeiro = async (req, res) => {
    const {COREN} = req.params;

    await usersModel.deleteEnfermeiro(COREN);
    return res.status(204).json();
}

// ====================== PACIENTES ======================

// Retorna todos os pacientes
const getAllPacientes = async (_req, res) => {

    const [pacientes] = await usersModel.getAllPacientes();

    return res.status(200).json(pacientes);
};

// Retorna um paciente pelo email
const getPacienteByEmail = async (req, res) => {
    const Email = req.params.Email;

    try {
        const paciente = await usersModel.getPacienteByEmail(Email);
        console.log('Paciente retornado pelo email:', paciente);
        return res.status(200).json(paciente);
    } catch (error) {
        console.log(error);
        return res.status(500).json({message: 'Erro ao buscar paciente por Email'});
    }
}

// Cria um novo paciente
const createPaciente = async (req, res) => {
    const createdPaciente = await usersModel.createPaciente(req.body);

    return res.status(201).json(createdPaciente);
}

// Atualiza um paciente pelo email
const updatePaciente = async (req, res) => {
    const {Email} = req.params;

    const updatedPaciente = await usersModel.updatePaciente(Email, req.body);
    return res.status(204).json(updatedPaciente);
}

// Deleta um paciente pelo email
const deletePaciente = async (req, res) => {
    const {Email} = req.params;

    await usersModel.deletePaciente(Email);
    return res.status(204).json();
}

// ====================== ADMINISTRADORES ======================

// Retorna todos os administradores
const getAllAdministradores = async (_req, res) => {

    const [administradores] = await usersModel.getAllAdministradores();

    return res.status(200).json(administradores);
};

// Retorna um administrador pelo email
const getAdministradorByEmail = async (req, res) => {
    const Email = req.params.Email;

    try {
        const adm = await usersModel.getAdministradorByEmail(Email);
        console.log('Administrador retornado pelo email:', adm);
        return res.status(200).json(adm);
    } catch (error) {
        console.log(error);
        return res.status(500).json({message: 'Erro ao buscar admin por Email'});
    }
}

// Cria um novo administrador
const createAdministrador = async (req, res) => {
    const createAdministrador = await usersModel.createAdministrador(req.body);

    return res.status(201).json(createAdministrador);
}

// Atualiza um administrador pelo email
const updateAdministrador = async (req, res) => {
    const {Email} = req.params;

    const updatedAdministrador = await usersModel.updateAdministrador(Email, req.body);
    return res.status(204).json(updatedAdministrador);
}

// Deleta um administrador pelo email
const deleteAdministrador = async (req, res) => {
    const {Email} = req.params;

    await usersModel.deleteAdministrador(Email);
    return res.status(204).json();
}

// Exporta as funções para uso nas rotas
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