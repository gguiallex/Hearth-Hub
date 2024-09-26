const validateBodyEspecialidades = (req, res, next) => {
    const {body} = req;

    if(body.CodEsp == undefined){
        return res.status(400).json({message: 'The field "CodEsp" is required'});
    }

    if(body.CodEsp == ''){
        return res.status(400).json({message: 'Esp code cannot be empty'});
    }

    if(body.Especialidade == undefined){
        return res.status(400).json({message: 'The field "Especialidade" is required'});
    }

    if(body.Especialidade == ''){
        return res.status(400).json({message: 'Especialidade cannot be empty'});
    }

    if(body.Descrição == undefined){
        return res.status(400).json({message: 'The field "Descrição" is required'});
    }

    if(body.Descrição == ''){
        return res.status(400).json({message: 'Descrição cannot be empty'});
    }

    next();
};

const validateBodyExames = (req, res, next) => {
    const {body} = req;

    /*if(body.Código == undefined){
        return res.status(400).json({message: 'The field "Código" is required'});
    }

    if(body.Código == ''){
        return res.status(400).json({message: 'Exame code cannot be empty'});
    }*/

    if(body.Nome == undefined){
        return res.status(400).json({message: 'The field "Nome" is required'});
    }

    if(body.Nome == ''){
        return res.status(400).json({message: 'Nome cannot be empty'});
    }

    if(body.Descrição == undefined){
        return res.status(400).json({message: 'The field "Descrição" is required'});
    }

    if(body.Descrição == ''){
        return res.status(400).json({message: 'Descrição cannot be empty'});
    }

    next();
};

const validateBodyExamesPresc = (req, res, next) => {
    const {body} = req;

    if(body.IdConsulta == undefined){
        return res.status(400).json({message: 'The field "IdConsulta" is required'});
    }

    if(body.IdConsulta == ''){
        return res.status(400).json({message: 'Consult code cannot be empty'});
    }

    if(body.CodExames == undefined){
        return res.status(400).json({message: 'The field "CodExames" is required'});
    }

    if(body.CodExames == ''){
        return res.status(400).json({message: 'Exame code cannot be empty'});
    }

    if(body.CPF == undefined){
        return res.status(400).json({message: 'The field "CPF" is required'});
    }

    if(body.CPF == ''){
        return res.status(400).json({message: 'CPF cannot be empty'});
    }

    if(body.CRM == undefined){
        return res.status(400).json({message: 'The field "CRM" is required'});
    }

    if(body.CRM == ''){
        return res.status(400).json({message: 'CRM cannot be empty'});
    }

    next();
};

module.exports = {
    validateBodyEspecialidades,
    validateBodyExames,
    validateBodyExamesPresc
}