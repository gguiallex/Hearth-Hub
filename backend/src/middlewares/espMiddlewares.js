// Middleware para validar o corpo da requisição para especialidades
const validateBodyEspecialidades = (req, res, next) => {
    const {body} = req;

    // Verifica se o campo "CodEsp" existe e não está vazio
    if(body.CodEsp == undefined){
        return res.status(400).json({message: 'The field "CodEsp" is required'});
    }
    if(body.CodEsp == ''){
        return res.status(400).json({message: 'Esp code cannot be empty'});
    }

    // Verifica se o campo "Especialidade" existe e não está vazio
    if(body.Especialidade == undefined){
        return res.status(400).json({message: 'The field "Especialidade" is required'});
    }
    if(body.Especialidade == ''){
        return res.status(400).json({message: 'Especialidade cannot be empty'});
    }

        // Verifica se o campo "Descrição" existe e não está vazio
    if(body.Descrição == undefined){
        return res.status(400).json({message: 'The field "Descrição" is required'});
    }
    if(body.Descrição == ''){
        return res.status(400).json({message: 'Descrição cannot be empty'});
    }

    // Se todas as verificações forem passadas, vai para a próxima etapa
    next();
};

// Middleware para validar o corpo da requisição para exames
const validateBodyExames = (req, res, next) => {
    const {body} = req;

    // Verifica se o campo "Nome" existe e não está vazio
    if(body.Nome == undefined){
        return res.status(400).json({message: 'The field "Nome" is required'});
    }
    if(body.Nome == ''){
        return res.status(400).json({message: 'Nome cannot be empty'});
    }

    // Verifica se o campo "Descrição" existe e não está vazio
    if(body.Descrição == undefined){
        return res.status(400).json({message: 'The field "Descrição" is required'});
    }
    if(body.Descrição == ''){
        return res.status(400).json({message: 'Descrição cannot be empty'});
    }

    // Se todas as verificações forem passadas, vai para a próxima etapa
    next();
};

// Middleware para validar o corpo da requisição para exames prescritos
const validateBodyExamesPresc = (req, res, next) => {
    const {body} = req;

    // Verifica se o campo "IdConsulta" existe e não está vazio
    if(body.IdConsulta == undefined){
        return res.status(400).json({message: 'The field "IdConsulta" is required'});
    }
    if(body.IdConsulta == ''){
        return res.status(400).json({message: 'Consult code cannot be empty'});
    }

    // Verifica se o campo "CodExames" existe e não está vazio
    if(body.CodExames == undefined){
        return res.status(400).json({message: 'The field "CodExames" is required'});
    }
    if(body.CodExames == ''){
        return res.status(400).json({message: 'Exame code cannot be empty'});
    }

    // Verifica se o campo "CPF" existe e não está vazio
    if(body.CPF == undefined){
        return res.status(400).json({message: 'The field "CPF" is required'});
    }
    if(body.CPF == ''){
        return res.status(400).json({message: 'CPF cannot be empty'});
    }

    // Verifica se o campo "CRM" existe e não está vazio
    if(body.CRM == undefined){
        return res.status(400).json({message: 'The field "CRM" is required'});
    }
    if(body.CRM == ''){
        return res.status(400).json({message: 'CRM cannot be empty'});
    }

    // Se todas as verificações forem passadas, vai para a próxima etapa
    next();
};

// Exporta os middlewares para serem usados em outras partes da aplicação
module.exports = {
    validateBodyEspecialidades,
    validateBodyExames,
    validateBodyExamesPresc
}