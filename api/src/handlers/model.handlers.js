const { createModel } = require('../controllers/model.controllers');

const newSTLModel= async(req, res)=> {
    const { name, material, link, price }= req.body;

    try {
        const model= await createModel(name, material, link, price);
        res.status(200).json(model);

    } catch(error) {

    }
};

module.exports= { newSTLModel };