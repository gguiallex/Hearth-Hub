// Middleware para validar o corpo da requisição para médicos
const validateBodyMedicos = (req, res, next) => {
    const {body} = req;

    // Verifica se o campo "CRM" está presente e não está vazio
    if(body.CRM == undefined){
        return res.status(400).json({message: 'The field "CRM" is required'});
    }
    if(body.CRM == ''){
        return res.status(400).json({message: 'CRM cannot be empty'});
    }

    // Verifica se o campo "Nome" está presente e não está vazio
    if(body.Nome == undefined){
        return res.status(400).json({message: 'The field "Nome" is required'});
    }
    if(body.Nome == ''){
        return res.status(400).json({message: 'Nome cannot be empty'});
    }

    // Verifica se o campo "Especialidade" está presente e não está vazio
    if(body.Especialidade == undefined){
        return res.status(400).json({message: 'The field "Especialidade" is required'});
    }
    if(body.Especialidade == ''){
        return res.status(400).json({message: 'Especialidade cannot be empty'});
    }

    // Verifica se o campo "Email" está presente e não está vazio
    if(body.Email == undefined){
        return res.status(400).json({message: 'The field "Email" is required'});
    }
    if(body.Email == ''){
        return res.status(400).json({message: 'Email cannot be empty'});
    }

    // Verifica se o campo "Senha" está presente e não está vazio
    if(body.Senha == undefined){
        return res.status(400).json({message: 'The field "Senha" is required'});
    }
    if(body.Senha == ''){
        return res.status(400).json({message: 'Senha cannot be empty'});
    }

    // Se todas as verificações forem passadas, vai para a próxima etapa
    next();
};

// Middleware para validar o corpo da requisição para enfermeiros
const validateBodyEnfermeiros = (req, res, next) => {
    const {body} = req;

    if(body.COREN == undefined){
        return res.status(400).json({message: 'The field "COREN" is required'});
    }
    if(body.COREN == ''){
        return res.status(400).json({message: 'COREN cannot be empty'});
    }

    if(body.Nome == undefined){
        return res.status(400).json({message: 'The field "Nome" is required'});
    }
    if(body.Nome == ''){
        return res.status(400).json({message: 'Nome cannot be empty'});
    }

    if(body.Email == undefined){
        return res.status(400).json({message: 'The field "Email" is required'});
    }
    if(body.Email == ''){
        return res.status(400).json({message: 'Email cannot be empty'});
    }

    if(body.Senha == undefined){
        return res.status(400).json({message: 'The field "Senha" is required'});
    }
    if(body.Senha == ''){
        return res.status(400).json({message: 'Senha cannot be empty'});
    }

    // Se todas as verificações forem passadas, vai para a próxima etapa
    next();
};

// Middleware para validar o corpo da requisição para pacientes
const validateBodyPacientes = (req, res, next) => {
    const {body} = req;

    if(body.CPF == undefined){
        return res.status(400).json({message: 'The field "CPF" is required'});
    }
    if(body.CPF == ''){
        return res.status(400).json({message: 'CPF cannot be empty'});
    }

    if(body.Nome == undefined){
        return res.status(400).json({message: 'The field "Nome" is required'});
    }
    if(body.Nome == ''){
        return res.status(400).json({message: 'Nome cannot be empty'});
    }

    if(body.Email == undefined){
        return res.status(400).json({message: 'The field "Email" is required'});
    }
    if(body.Email == ''){
        return res.status(400).json({message: 'Email cannot be empty'});
    }

    if(body.Senha == undefined){
        return res.status(400).json({message: 'The field "Senha" is required'});
    }
    if(body.Senha == ''){
        return res.status(400).json({message: 'Senha cannot be empty'});
    }

    // Se todas as verificações forem passadas, vai para a próxima etapa
    next();
};

// Middleware para validar o corpo da requisição para administradores
const validateBodyAdministradores = (req, res, next) => {
    const {body} = req;

    if(body.CPF == undefined){
        return res.status(400).json({message: 'The field "CPF" is required'});
    }
    if(body.CPF == ''){
        return res.status(400).json({message: 'CPF cannot be empty'});
    }

    if(body.Nome == undefined){
        return res.status(400).json({message: 'The field "Nome" is required'});
    }
    if(body.Nome == ''){
        return res.status(400).json({message: 'Nome cannot be empty'});
    }

    if(body.Email == undefined){
        return res.status(400).json({message: 'The field "Email" is required'});
    }
    if(body.Email == ''){
        return res.status(400).json({message: 'Email cannot be empty'});
    }

    if(body.Senha == undefined){
        return res.status(400).json({message: 'The field "Senha" is required'});
    }
    if(body.Senha == ''){
        return res.status(400).json({message: 'Senha cannot be empty'});
    }

    // Se todas as verificações forem passadas, vai para a próxima etapa
    next();
};

// Exporta os middlewares para serem usados em rotas específicas
module.exports = {
    validateBodyMedicos,
    validateBodyEnfermeiros,
    validateBodyPacientes,
    validateBodyAdministradores
};