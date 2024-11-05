const connection = require('../models/connection');

const getAllEsps = async () => {
    const esps = await connection.execute('SELECT * FROM especialidade');
    return esps;
};

const getAllExames = async () => {
    const exames = await connection.execute('SELECT * FROM exames');
    return exames;
};

const getExameByCodigo = async (codigo) => {
    const [exame] = await connection.execute('SELECT * FROM exames WHERE CodExames = ?', [codigo]);
    return exame;
}

const getExamesByEnf = async (COREN) => {
    const [exame] = await connection.execute('SELECT * FROM examesPrescritos WHERE COREN = ?', [COREN]);
    return exame;
}

const createEsp = async (especialidade) => {
    const { CodEsp, Especialidade, Descrição } = especialidade;

    const query = 'INSERT INTO especialidade(CodEsp, Especialidade, Descrição) VALUES (?, ?, ?)';

    const [createdEspecialidade] = await connection.execute(query, [CodEsp, Especialidade, Descrição]);
    return {createdEspecialidade};
};

const createExame = async (exame) => {
    const { Nome, Descrição } = exame;

    const query = 'INSERT INTO exames(Nome, Descrição) VALUES (?, ?)';

    const [createdExame] = await connection.execute(query, [ Nome, Descrição]);
    return {createdExame};
};

const deleteEsp = async (CodEsp) => {
    const [removedEsp] = await connection.execute('DELETE FROM especialidade where CodEsp = ?', [CodEsp]);
    return removedEsp;
}

const deleteExame = async (Código) => {
    const [removedExame] = await connection.execute('DELETE FROM exames where CodExames = ?', [Código]);
    return removedExame;
}

const updateEsp = async (CodEsp, Esp) => {

    const {Especialidade, Descrição} = Esp

    const query = 'UPDATE especialidade set CodEsp = ?, Especialidade = ?, Descrição = ? WHERE CodEsp = ?';

    const [updatedEsp] = await connection.execute(query, [CodEsp, Especialidade, Descrição, CodEsp]);
    return updatedEsp;
}

const updateExame = async (Código, Exame) => {

    const {Nome, Descrição} = Exame;

    const query = 'UPDATE exames set Nome = ?, Descrição = ? WHERE CodExames = ?';

    const [updatedExame] = await connection.execute(query, [ Nome, Descrição, Código]);
    return updatedExame;
}

const getAllConsult = async () => {
    const consult = await connection.execute('SELECT * FROM consultas');
    return consult;
}

const GetAllExamesPresc = async () => {
    const examesPresc = await connection.execute('SELECT * FROM examesPrescritos');
    return examesPresc;
}

const getAllExamesByCPF = async (CPF) => {
    const [exames] = await connection.execute('SELECT * FROM examesPrescritos WHERE CPF = ?', [CPF]);
    return exames;
}

const getExameByIdConsulta = async (idConsulta) => {
    const [exame] = await connection.execute('SELECT * FROM examesPrescritos WHERE IdConsulta = ?', [idConsulta]);
    return exame;
}

const createConsult = async (consulta) => {
    const {CPF, CRM, data, Horario} = consulta;

    const query ='INSERT INTO consultas(CPF, CRM, data, Horario) VALUES (?,?,?,?)';

    const [createdCons] = await connection.execute(query,[CPF, CRM, data, Horario]);
    return {createdCons};
}

const createExamePresc = async (examePresc) => {
    const { IdConsulta, CodExames, CPF, CRM  } = examePresc;

    const query = 'INSERT INTO examesPrescritos(IdConsulta, CodExames, CPF, CRM, DataPrescricao, Status) VALUES (?, ?, ?, ?, NOW(), ?)';

    const [createdExamePresc] = await connection.execute(query, [ IdConsulta, CodExames, CPF, CRM, 'Pendente']);
    return {createdExamePresc};
};

const updateExamePresc = async (IdConsulta, CodExames, COREN, Status) => {
    
    const query = 'UPDATE examesPrescritos set COREN = ?, DataRealizacao = NOW(), Status = ? WHERE IdConsulta = ? AND CodExames = ?';

    const [updatedExamePresc] = await connection.execute(query, [ COREN, Status, IdConsulta, CodExames]);
    return updatedExamePresc;
}

const getAllMedicosByEspecialidade = async (especialidade) => {
    const [medicos] = await connection.execute('SELECT * FROM médicos WHERE Especialidade = ?', [especialidade]);
    return medicos;
};

const getAllConsultasByCRM = async (CRM) => {
    const [consultas] = await connection.execute('SELECT * FROM consultas WHERE CRM = ?', [CRM]);
    console.log('Consultas obtidas do banco de dados:', consultas);
    return consultas;
};

const getEspecialidadeByCRM = async(CRM) => {
    const [especialidade] = await connection.execute('SELECT especialidade FROM médicos WHERE CRM = ?', [CRM]);
    return especialidade;
}

const getAllConsultasByPacientes = async (CPF) => {
    const [consultas] = await connection.execute('SELECT * FROM consultas WHERE CPF = ?', [CPF]);
    return consultas;
}

module.exports = {
    getAllEsps,
    getAllExames,
    getExameByCodigo,
    getExamesByEnf,
    createEsp,
    createExame,
    deleteEsp,
    deleteExame,
    updateEsp,
    updateExame,
    getAllConsult,
    GetAllExamesPresc,
    getAllExamesByCPF,
    getExameByIdConsulta,
    createConsult,
    createExamePresc,
    updateExamePresc,
    getAllMedicosByEspecialidade,
    getAllConsultasByCRM,
    getEspecialidadeByCRM,
    getAllConsultasByPacientes,
}