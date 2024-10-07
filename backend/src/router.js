const express = require('express');
const router = express.Router();

const EspController = require('./controllers/EspController');
const espMiddlewares = require('./middlewares/espMiddlewares');

const UsersController = require('./controllers/UsersController');
const usersMiddlewares = require('./middlewares/usersMiddlewares');

const authController = require('./controllers/AuthController');


router.get("/", (req, res) => {
    return res.json("hello world");
});

router.get('/medicos', UsersController.getAllMedicos);
router.post('/medicos', usersMiddlewares.validateBodyMedicos, UsersController.createMedico);
router.put('/medico/:CRM', usersMiddlewares.validateBodyMedicos, UsersController.updateMedico);
router.delete('/medico/:CRM', UsersController.deleteMedico);
router.get('/medicos/especialidade/:especialidade', EspController.getAllMedicosByEspecialidade);
router.get('/medicos/:CRM', UsersController.getMedicoByCRM);

router.get('/enfermeiros', UsersController.getAllEnfermeiros);
router.post('/enfermeiros', usersMiddlewares.validateBodyEnfermeiros, UsersController.createEnfermeiro);
router.put('/enfermeiro/:COREN', usersMiddlewares.validateBodyEnfermeiros, UsersController.updateEnfermeiro);
router.delete('/enfermeiro/:COREN', UsersController.deleteEnfermeiro);
router.get('/enfermeiro/:COREN', UsersController.getEnfermeiroByCOREN);

router.get('/pacientes', UsersController.getAllPacientes);
router.get('/paciente/:Email', UsersController.getPacienteByEmail);
router.post('/pacientes', usersMiddlewares.validateBodyPacientes, UsersController.createPaciente);
router.put('/paciente/:Email', usersMiddlewares.validateBodyPacientes, UsersController.updatePaciente);
router.delete('/paciente/:Email',UsersController.deletePaciente);

router.get('/administradores', UsersController.getAllAdministradores);
router.get('/administrador/:Email', UsersController.getAdministradorByEmail);
router.post('/administradores', usersMiddlewares.validateBodyAdministradores, UsersController.createAdministrador);
router.put('/administrador/:Email', usersMiddlewares.validateBodyAdministradores, UsersController.updateAdministrador);
router.delete('/administrador/:Email', UsersController.deleteAdministrador);

router.get('/especialidades', EspController.getAllEsps);
router.post('/especialidade', espMiddlewares.validateBodyEspecialidades, EspController.createEsp);
router.delete('/especialidade/:CodEsp', EspController.deleteEsp);
router.put('/especialidade/:CodEsp', espMiddlewares.validateBodyEspecialidades, EspController.updateEsp);
router.get('/especialidades/:CRM', EspController.getEspecialidadeByCRM);

router.get('/exames', EspController.getAllExames);
router.get('/exame/:CodExames', EspController.getExameByCod);
router.post('/exame', espMiddlewares.validateBodyExames, EspController.createExame);
router.delete('/exame/:CodExames', EspController.deleteExame);
router.put('/exame/:CodExames', espMiddlewares.validateBodyExames, EspController.updateExame);

router.get('/examesPrescritos', EspController.getAllExamesPresc);
router.post('/examePrescrito', espMiddlewares.validateBodyExamesPresc, EspController.createExamePresc);
router.get('/examePrescrito/paciente/:CPF', EspController.getAllExamesByPacientes);
router.get('/examePrescrito/consulta/:IdConsulta', EspController.getExameByIdConsulta);
router.get('/examesPrescritos/:COREN', EspController.getExamesByEnf);
router.put('/examePrescrito/:IdConsulta/:CodExames', EspController.updateExamePresc);

router.post('/autenticar', authController.autenticar);
router.post('/gerar-token-confirmacao', authController.gerarTokenConfirmaçãoDeConta);
router.post('/confirmar-conta', authController.validarConta);

router.get('/consultas', EspController.getAllConsult);
router.post('/consultas', EspController.createConsult);
router.get('/consultas/medico/:CRM', EspController.getAllConsultasByCRM);
router.get('/consultas/paciente/:CPF', EspController.getAllConsultasByPacientes);

router.post('/recuperar-senha', authController.gerarTokenRecuperacaoSenha);
router.post('/redefinir-senha', authController.redefinirSenhaPeloLink);

router.post('/conta-aprovada', authController.emailAprovado);


module.exports = router;