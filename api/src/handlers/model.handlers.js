const { createModel, getAllModels, getModelsByCompany, getModelsByName,  modifyModelCtrl } = require('../controllers/model.controllers');
const models = require('../utils/modelsPrueba');
const { Model }= require('../db');
const axios= require('axios');
const cheerio = require('cheerio');

const createModelsDB= async (req, res)=> {
    try {
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
    const { id }= req.user;
    try{
        const modelsByCompany= await getModelsByCompany(id);
        res.status(200).json(modelsByCompany);

    } catch(error) {
        res.status(500).json({ error: 'Error Getting Models By Company', message: error.message });
    }
};

const modelsByName= async (req, res)=> {
    const { id }= req.user;
    const { name } = req.query;

    try {
        const models= await getModelsByName(id, name);
        res.status(200).json(models);

        } catch (error){
            res.status(500).json({ error: 'Error Getting Models By Name', message: error.message });
        }
}


const getDolar= async(req, res)=> {
    try {
        const response = await axios.get('https://www.bna.com.ar/Personas');
        const html = response.data;
        const $ = cheerio.load(html);
        let valor = $('table.table.cotizacion tr:nth-child(1) td:nth-child(3)').text().replace(/,/g, '.');;
        valor= parseFloat(valor.slice(0,7));

        res.status(200).json({valor});

      } catch (error) {
        console.error(error);
        res.status(500).json({error: 'Error geting dolar value', message: error.message});
      }
}




module.exports= { newSTLModel, allModels, companyModels, createModelsDB, modelsByName, modifyModel, getDolar };