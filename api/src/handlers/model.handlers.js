const { createModel, getAllModels, getModelsByCompany, getModelsByName,  modifyModelCtrl } = require('../controllers/model.controllers');
const models = require('../utils/modelsPrueba');
const { Model }= require('../db');


const createModelsDB= async (req, res)=> {
    try {
        console.log(models[1]);
        await Promise.all(models.map(async (el) => { 
          await Model.create(el);
        })); 
  
       res.status(201).send("Modelos Creados en DB")
      }
      catch(error) {res.status(500).json(console.log(error))}
};

const newSTLModel= async(req, res)=> {
    const { name, material, link, price, companyName, image }= req.body;

    try {
        const model= await createModel(name, material, link, price, companyName, image);
        res.status(200).json(model);

    } catch(error) {
        res.status(500).json({ error: 'Error in STL-Model Creation', message: error.message });
    }
};

const allModels= async(req, res)=> {
    try{
        const allModels= await getAllModels();
        res.status(200).json(allModels);

    } catch(error) {
        res.status(500).json({ error: 'Error Getting AllModels', message: error.message });
    }
};

const modifyModel= async(req, res)=> {

    let {id, name, material, link, price, companyName, image }= req.body;

    try {
        const modelModified= await modifyModelCtrl(id, name, material, link, price, companyName, image);
        res.status(200).json(modelModified);
    } catch(error) {
        res.status(500).json({ error: 'Error Modifyng model', message: error.message });
    }
}

const companyModels= async (req, res)=> {
    
    //const {companyName}= req.body; //no hara falta xq lo saco con el token, llego a los datos del user logueado
    if(req?.headers?.authorization?.startsWith('Bearer')){
        let token= req.headers.authorization.split(" ")[1];

        try{
            const modelsByCompany= await getModelsByCompany(token);
            res.status(200).json(modelsByCompany);

        } catch(error) {
        res.status(500).json({ error: 'Error Getting Models By Company', message: error.message });
        }
    } else {
        res.status(500).send('There is no token attached to header');
    }
};

const modelsByName= async (req, res)=> {
    
    if(req?.headers?.authorization?.startsWith('Bearer')){
        let token= req.headers.authorization.split(" ")[1];

        const { name } = req.query;

        try{
            const models= await getModelsByName(token, name);
            res.status(200).json(models);

        } catch (error){
            res.status(500).json({ error: 'Error Getting Models By Name', message: error.message });
        }
    
    
    } else {
        res.status(500).send('There is no token attached to header');
    }
}






module.exports= { newSTLModel, allModels, companyModels, createModelsDB, modelsByName, modifyModel };