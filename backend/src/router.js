const express = require('express'); // Importa o módulo Express para criar rotas
const router = express.Router(); // Cria uma instância do roteador do Express

const EspController = require('./controllers/EspController'); // Importa os controladores responsáveis pela lógica das especialidades
const espMiddlewares = require('./middlewares/espMiddlewares'); // Importa os middlewares de validação para especialidades

const UsersController = require('./controllers/UsersController'); // Importa os controladores responsáveis pela lógica dos usuários
const usersMiddlewares = require('./middlewares/usersMiddlewares'); // Importa os middlewares de validação para usuários

const authController = require('./controllers/AuthController'); // Importa o controlador de autenticação

// Rota básica de teste para verificar se o servidor está funcionando
router.get("/", (req, res) => {
    return res.json("hello world");
});

// CRUD de Médicos
router.get('/medicos', UsersController.getAllMedicos); // Retorna todos os médicos
router.post('/medicos', usersMiddlewares.validateBodyMedicos, UsersController.createMedico); // Cria um novo médico
router.put('/medico/:CRM', usersMiddlewares.validateBodyMedicos, UsersController.updateMedico); // Atualiza médico pelo CRM
router.delete('/medico/:CRM', UsersController.deleteMedico); // Deleta médico pelo CRM
router.get('/medicos/especialidade/:especialidade', EspController.getAllMedicosByEspecialidade); // Retorna médicos por especialidade
router.get('/medicos/:CRM', UsersController.getMedicoByCRM); // Retorna médico pelo CRM

// CRUD de Enfermeiros
router.get('/enfermeiros', UsersController.getAllEnfermeiros); // Retorna todos os enfermeiros
router.post('/enfermeiros', usersMiddlewares.validateBodyEnfermeiros, UsersController.createEnfermeiro); // Cria um novo enfermeiro
router.put('/enfermeiro/:COREN', usersMiddlewares.validateBodyEnfermeiros, UsersController.updateEnfermeiro); // Atualiza enfermeiro pelo COREN
router.delete('/enfermeiro/:COREN', UsersController.deleteEnfermeiro); // Deleta enfermeiro pelo COREN
router.get('/enfermeiro/:COREN', UsersController.getEnfermeiroByCOREN); // Retorna enfermeiro pelo COREN

// CRUD de Pacientes
router.get('/pacientes', UsersController.getAllPacientes); // Retorna todos os pacientes
router.get('/paciente/:Email', UsersController.getPacienteByEmail); // Retorna paciente pelo Email
router.post('/pacientes', usersMiddlewares.validateBodyPacientes, UsersController.createPaciente); // Cria um novo paciente
router.put('/paciente/:Email', usersMiddlewares.validateBodyPacientes, UsersController.updatePaciente); // Atualiza paciente pelo Email
router.delete('/paciente/:Email',UsersController.deletePaciente); // Deleta paciente pelo Email

// CRUD de Administradores
router.get('/administradores', UsersController.getAllAdministradores); // Retorna todos os administradores
router.get('/administrador/:Email', UsersController.getAdministradorByEmail); // Retorna administrador pelo Email
router.post('/administradores', usersMiddlewares.validateBodyAdministradores, UsersController.createAdministrador); // Cria um novo administrador
router.put('/administrador/:Email', usersMiddlewares.validateBodyAdministradores, UsersController.updateAdministrador); // Atualiza administrador pelo Email
router.delete('/administrador/:Email', UsersController.deleteAdministrador); // Deleta administrador pelo Email

// CRUD de Especialidades
router.get('/especialidades', EspController.getAllEsps); // Retorna todas as especialidades
router.post('/especialidade', espMiddlewares.validateBodyEspecialidades, EspController.createEsp); // Cria uma nova especialidade
router.delete('/especialidade/:CodEsp', EspController.deleteEsp); // Deleta especialidade pelo código
router.put('/especialidade/:CodEsp', espMiddlewares.validateBodyEspecialidades, EspController.updateEsp); // Atualiza especialidade pelo código
router.get('/especialidades/:CRM', EspController.getEspecialidadeByCRM); // Retorna especialidade pelo CRM

// CRUD de Exames
router.get('/exames', EspController.getAllExames); // Retorna todos os exames
router.get('/exame/:CodExames', EspController.getExameByCod); // Retorna exame pelo código
router.post('/exame', espMiddlewares.validateBodyExames, EspController.createExame); // Cria um novo exame
router.delete('/exame/:CodExames', EspController.deleteExame); // Deleta exame pelo código
router.put('/exame/:CodExames', espMiddlewares.validateBodyExames, EspController.updateExame); // Atualiza exame pelo código

// Exames Preescritos
router.get('/examesPrescritos', EspController.getAllExamesPresc); // Retorna todos os exames prescritos
router.post('/examePrescrito', espMiddlewares.validateBodyExamesPresc, EspController.createExamePresc); // Cria um exame prescrito
router.get('/examePrescrito/paciente/:CPF', EspController.getAllExamesByPacientes); // Retorna exames prescritos por CPF do paciente
router.get('/examePrescrito/consulta/:IdConsulta', EspController.getExameByIdConsulta); // Retorna exame por ID da consulta
router.get('/examesPrescritos/:COREN', EspController.getExamesByEnf); // Retorna exames pelo COREN do enfermeiro
router.put('/examePrescrito/:IdConsulta/:CodExames', EspController.updateExamePresc); // Atualiza exame prescrito pelo ID da consulta e código

// Autenticação
router.post('/autenticar', authController.autenticar); // Autentica usuário
router.post('/gerar-token-confirmacao', authController.gerarTokenConfirmaçãoDeConta); // Gera token de confirmação de conta
router.post('/confirmar-conta', authController.validarConta); // Valida conta com token

// Consultas
router.get('/consultas', EspController.getAllConsult); // Retorna todas as consultas
router.post('/consultas', EspController.createConsult); // Cria uma nova consulta
router.get('/consultas/medico/:CRM', EspController.getAllConsultasByCRM); // Retorna consultas pelo CRM do Médico
router.get('/consultas/paciente/:CPF', EspController.getAllConsultasByPacientes); // Retorna consultas pelo CPF do paciente

// Recuperação de Senha
router.post('/recuperar-senha', authController.gerarTokenRecuperacaoSenha); // Gera token para recuperação de senha
router.post('/redefinir-senha', authController.redefinirSenhaPeloLink); // Redefine senha pelo link com token

// Notificação de Conta Aprovada
router.post('/conta-aprovada', authController.emailAprovado); // Envia e-mail de conta aprovada

// Exporta o roteador para ser utilizado no servidor principal
module.exports = router;