const { Model, User }= require('../db');
const jwt= require('jsonwebtoken');
require('dotenv').config();
const { BCRA_TOKEN } = process.env;
const axios= require('axios');

const createModel= async(name, material, link, price, companyName, image)=> {
    const model= Model.create({
        name,
        material,
        link,
        price,
        companyName,
        image
    });

    return model;
};

const getAllModels= async()=> {
    const allModels= await Model.findAll();
    return allModels;
}

const getModelsByCompany= async (token)=> {
    if (token){
        const allModels= await getAllModels();
        const decoded= jwt.verify(token, process.env.JWT_SECRET);
        // console.log(decoded);
        const user= await User.findByPk(decoded?.id); 
        const companyName= user.companyName;
        const findModels= allModels.filter(m=> m.companyName.toLowerCase().includes(companyName.toLowerCase()));
       
        return findModels;

    } else throw new Error('Not Authorized, token expired, please login again')
}

const getModelsByName= async (token, name)=> {
    const allModels= await getModelsByCompany(token);
    const findModels= allModels.filter(m=> m.name.toLowerCase().includes(name.toLowerCase()));
  
    return findModels;
}
    
const modifyModelCtrl= async(id, name, material, link, price, companyName, image) => {
    
    await Model.update({
        name,
        material,
        link,
        price,
        companyName,
        image
    }, { where: {id: id} });

    const findModel= await Model.findByPk(id);
    return findModel;
}

const usdToArs= async(token)=> {
    console.log(token);
    const result= await axios.get("https://api.estadisticasbcra.com/usd_of" ,
    {
        headers: {
            Authorization: `BEARER ${BCRA_TOKEN}`
          }
    });
    let lastIndex= result.data.length;
    console.log(result.data);
    return (result.data[lastIndex-1]);

    
};


module.exports= { createModel, getAllModels, getModelsByCompany, getModelsByCompany, getModelsByName, modifyModelCtrl, usdToArs };