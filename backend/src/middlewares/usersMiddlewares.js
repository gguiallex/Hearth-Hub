const validateBodyMedicos = (req, res, next) => {
    const {body} = req;

    if(body.CRM == undefined){
        return res.status(400).json({message: 'The field "CRM" is required'});
    }

    if(body.CRM == ''){
        return res.status(400).json({message: 'CRM cannot be empty'});
    }

    if(body.Nome == undefined){
        return res.status(400).json({message: 'The field "Nome" is required'});
    }

    if(body.Nome == ''){
        return res.status(400).json({message: 'Nome cannot be empty'});
    }

    if(body.Especialidade == undefined){
        return res.status(400).json({message: 'The field "Especialidade" is required'});
    }

    if(body.Especialidade == ''){
        return res.status(400).json({message: 'Especialidade cannot be empty'});
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

    next();
};

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


    next();
};

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

    next();
};

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
    next();
};

module.exports = {
    validateBodyMedicos,
    validateBodyEnfermeiros,
    validateBodyPacientes,
    validateBodyAdministradores
};