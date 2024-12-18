const { request, response } = require('express'); // Importa as funções de solicitação e resposta do Express
const espModel = require('../models/espModel'); // Importa o modelo de especialidades, exames e consultas

// ====================== ESPECIALIDADES ======================

// Retorna todas as especialidades
const getAllEsps = async (_req, res) => {

    const [esps] = await espModel.getAllEsps();

    return res.status(200).json(esps);
};

// Cria uma nova especialidade
const createEsp = async (req, res) => {
    const createdEsp = await espModel.createEsp(req.body);

    return res.status(201).json(createdEsp);
}

// Deleta uma especialidade pelo código
const deleteEsp = async (req, res) => {
    const {CodEsp} = req.params;

    await espModel.deleteEsp(CodEsp);
    return res.status(204).json();
}

// Atualiza uma especialidade pelo código
const updateEsp = async (req, res) => {
    const {CodEsp} = req.params;

    await espModel.updateEsp(CodEsp, req.body);
    return res.status(204).json();
};

// ====================== EXAMES ======================

// Retorna todos os exames
const getAllExames = async (_req, res) => {

    const [exames] = await espModel.getAllExames();

    return res.status(200).json(exames);
};

// Retorna um exame pelo código
const getExameByCod = async (req, res) => {
    CodExames = req.params.CodExames

    const exame = await espModel.getExameByCodigo(CodExames);
    return res.status(200).json(exame);
};

// Cria um novo exame
const createExame = async (req, res) => {
    const createdExame = await espModel.createExame(req.body);

    return res.status(201).json(createdExame);
}

// Deleta um exame pelo código
const deleteExame = async (req, res) => {
    const {CodExames} = req.params;

    await espModel.deleteExame(CodExames);
    return res.status(204).json();
};

// Atualiza um exame pelo código
const updateExame = async (req, res) => {
    const {CodExames} = req.params;

    await espModel.updateExame(CodExames, req.body);
    return res.status(204).json();
};

// ====================== EXAMES PRESCRITOS ======================

// Preescreve um exame
const createExamePresc = async (req, res) => {
    const createdPresc = await espModel.createExamePresc(req.body);

    return res.status(201).json(createdPresc);
};

// Retorna todos os exames prescritos
const getAllExamesPresc = async (_req, res) => {

    const [examesPresc] = await espModel.GetAllExamesPresc();

    return res.status(200).json(examesPresc);
}

// Atualiza um exame prescrito pelo ID da consulta e código do exame
const updateExamePresc = async (req, res) => {
    const {IdConsulta, CodExames} = req.params;
    const { COREN, Status} = req.body;

    try {
        await espModel.updateExamePresc(IdConsulta, CodExames, COREN, Status);
        return res.status(204).json();
    } catch (error) {
        console.error('Erro ao atualizar exame prescrito:', error);
        return res.status(500).json({ message: 'Erro interno do servidor.' });
    }
};

// Retorna exames prescritos por CPF
const getAllExamesByPacientes = async (req, res) => {
    const CPF = req.params.CPF;

    try {
        const exames = await espModel.getAllExamesByCPF(CPF);
        console.log('exames retornados pelo banco de dados:', exames);
        return res.status(200).json(exames);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Erro ao buscar exames pelo paciente' });
    }
};

// Retorna exames prescritos por ID da consulta
const getExameByIdConsulta = async (req, res) => {
    const idConsulta = req.params.IdConsulta;

    try {
        const exame = await espModel.getExameByIdConsulta(idConsulta);
        console.log('exames retornados pelo banco de dados:', exame);
        return res.status(200).json(exame);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Erro ao buscar exames pelo Id da Consulta' });
    }
};

// Retorna exames realizados por um enfermeiro (via COREN)
const getExamesByEnf = async (req, res) => {
    const COREN = req.params.COREN;

    try {
        const exames = await espModel.getExamesByEnf(COREN);
        console.log('exames retornados pelo banco de dados: ', exames);
        return res.status(200).json(exames);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Erro ao buscar exames realizados pelo enfermeiro' });
    }
};

// ====================== CONSULTAS ======================

// Cria uma nova consulta
const createConsult = async (req, res) => {
    const createdCons = await espModel.createConsult(req.body);

    return res.status(201).json(createdCons);
};

// Retorna todas as consultas
const getAllConsult = async (_req, res) => {

    const [consult] = await espModel.getAllConsult();

    return res.status(200).json(consult);
};

// Retorna consultas pelo CRM do médico
const getAllConsultasByCRM = async (req, res) => {
    const CRM = req.params.CRM;

    try {
        const consultas = await espModel.getAllConsultasByCRM(CRM); // Verifique o nome da função aqui
        console.log('Consultas retornadas pelo banco de dados:', consultas); // Log dos dados retornados
        return res.status(200).json(consultas);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Erro ao buscar consultas pelo médico' });
    }
};

// Retorna consultas pelo CPF do paciente
const getAllConsultasByPacientes = async (req, res) => {
    const paciente = req.params.CPF;

    try{
        const consultas = await espModel.getAllConsultasByPacientes(paciente);
        return res.status(200).json(consultas);
    } catch(error){
        console.error(error);
        return res.status(500).json({ message: 'Erro ao buscar consultas pelo CPF'});
    }
}

// ====================== MÉDICOS ======================

// Retorna todos os médicos por especialidade
const getAllMedicosByEspecialidade = async (req, res) => {
    const especialidade = req.params.especialidade;

    try {
        const medicos = await espModel.getAllMedicosByEspecialidade(especialidade);
        return res.status(200).json(medicos);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Erro ao buscar médicos por especialidade' });
    }
};

// Retorna a especialidade de um médico pelo CRM
const getEspecialidadeByCRM = async (req, res) => {
    const CRM = req.params.CRM;

    try {
        const especialidade = await espModel.getEspecialidadeByCRM(CRM);
        return res.status(200).json(especialidade);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Erro ao buscar especialidade por CRM' });
    }
};

// Exporta as funções para uso nas rotas
module.exports = {
    getAllEsps,
    getAllExames,
    getExameByCod,
    getExamesByEnf,
    createEsp,
    createExame,
    deleteEsp,
    deleteExame,
    updateEsp,
    updateExame,
    getAllConsult,
    getAllExamesPresc,
    createConsult,
    updateExamePresc,
    createExamePresc,
    getAllExamesByPacientes,
    getExameByIdConsulta,
    getAllMedicosByEspecialidade,
    getAllConsultasByCRM,
    getEspecialidadeByCRM,
    getAllConsultasByPacientes,
};
