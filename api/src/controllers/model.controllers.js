const { Model, User }= require('../db');
const jwt= require('jsonwebtoken');

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
    
   


module.exports= { createModel, getAllModels, getModelsByCompany, getModelsByCompany, getModelsByName };