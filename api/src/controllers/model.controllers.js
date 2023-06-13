const { Model }= require('../db');

const createModel= async(name, material, link, price)=> {
    const model= Model.create({
        name,
        material,
        link,
        price
    });

    return model;
};

module.exports= { createModel };