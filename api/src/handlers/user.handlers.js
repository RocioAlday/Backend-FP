const { userCreation }= require('../controllers/user.controllers');

const newUser= async (req, res)=> {
    const { companyName, firstname, lastname, email, phone, image, password, status }= req.body;
    try {
        const user= await userCreation(companyName, firstname, lastname, email, phone, image, password, status); 
        res.status(201).send({ userData: user });
    } catch(error) {
        res.status(500).json({ error: 'Error in user creation', message: error.message })
    }
}

module.exports= { newUser }