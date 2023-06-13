const { userCreation, userLogin, logOutUserCtr }= require('../controllers/user.controllers');

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
};

const logoutUser= async (req, res)=> {

    const cookies= req.cookies;

    try{
        if(!cookies.refreshToken) throw new Error ('No RefreshToken in cookies');
        const token= cookies.refreshToken;
        const userlogOut= await logOutUserCtr(token);

        res.clearCookie('refreshToken', {
            httpOnly: true,
            secure: true,
        });

        res.status(200).send({userId:userlogOut}); 

    } catch (error) {
        res.status(500).json({ error: 'Error in user Logout', message: error.message })
    }
    
}

module.exports= { newUser, loginUser, logoutUser }