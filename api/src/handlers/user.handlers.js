const { userCreation, userLogin, logOutUserCtr, getUsers }= require('../controllers/user.controllers');

const newUser= async (req, res)=> {
    const { companyName, companyCUIT, taxCondition, firstname, lastname, email, phone, image, password, status }= req.body;
    try {
        const user= await userCreation(companyName, companyCUIT, taxCondition, firstname, lastname, email, phone, image, password, status); 
        res.status(201).send({ userData: user });
    } catch(error) {
        res.status(500).json({ error: 'Error in user creation', message: error.message })
    }
};

const loginUser= async (req, res)=> {
    const { email, password }= req.body;
    console.log(email, password);
    console.log(req.body);
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
   
    let token= req.headers.authorization.split(" ")[1];
   
    try{
        if(token){
            const userlogOut= await logOutUserCtr(token);

            res.clearCookie('refreshToken', {
                httpOnly: true,
                secure: true,
            });
            res.status(200).send({userId:userlogOut});
    
        } else throw new Error ('No RefreshToken in cookies');


    } catch (error) {
        res.status(500).json({ error: 'Error in user Logout', message: error.message })
    }   
};

const allUsers= async (req, res)=> {
    
    try {
        const users= await getUsers();
        res.status(200).send(users);
    
    } catch(error) {
        res.status(500).json({ message: 'Can not get all users', error: error.message});
    }
}


module.exports= { newUser, loginUser, logoutUser, allUsers }