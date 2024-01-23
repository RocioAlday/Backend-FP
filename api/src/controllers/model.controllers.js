const { Model, User }= require('../db');


const createModel= async(name, material, link, price, companyName, image, parameters)=> {
    const model= Model.create({
        name,
        material,
        link,
        price,
        companyName,
        image,
        parameters
    });

    return model;
};

const getAllModels= async()=> {
    const allModels= await Model.findAll();
    return allModels;
}

const getModelsByCompany= async (id)=> {
    const user= await User.findByPk(id);
    const allModels= await getAllModels();
    const companyName= user.companyName;
    const findModels= allModels.filter(m=> m.companyName.toLowerCase().includes(companyName.toLowerCase()));
       
    return findModels;
}

const getModelsByName= async (id, name)=> {
    const allModels= await getModelsByCompany(id);
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



module.exports= { createModel, getAllModels, getModelsByCompany, getModelsByCompany, getModelsByName, modifyModelCtrl };