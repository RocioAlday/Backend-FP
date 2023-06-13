const { userCreation, userLogin }= require('../controllers/user.controllers');

const newUser= async (req, res)=> {
    const { companyName, firstname, lastname, email, phone, image, password, status }= req.body;
    try {
        const user= await userCreation(companyName, firstname, lastname, email, phone, image, password, status); 
        res.status(201).send({ userData: user });
    } catch(error) {
        res.status(500).json({ error: 'Error in user creation', message: error.message })
    }
};

const loginUser= async (req, res)=> {
    const { email, password }= req.body;
    try{
        const loginData= await userLogin(email, password);
        const token= loginData.refreshToken;

        res.cookie('refreshToken', token, {
            httpOnly: true,
            maxAge: 72*60*60*1000,
        });

        res.status(201).send(loginData);

    } catch (error) {
        res.status(500).json({ error: 'Error in user login', message: error.message })
    }
}

module.exports= { newUser, loginUser }