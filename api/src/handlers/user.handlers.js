const { userCreation, userLogin, logOutUserCtr, getUsers, getUserInfo, sendMailContact }= require('../controllers/user.controllers');
const jwt= require('jsonwebtoken');

const newUser= async (req, res)=> {
    const { companyName, companyCUIT, taxCondition, firstname, lastname, email, phone, image, password, role }= req.body;
    try {
        const user= await userCreation(companyName, companyCUIT, taxCondition, firstname, lastname, email, phone, image, password, role); 
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

const getUserData= async(req, res)=> {
    let token= req.headers.authorization.split(" ")[1];
   
    const decoded= jwt.verify(token, process.env.JWT_SECRET);
    let userId= decoded.id;
        
    try {
        const data= await getUserInfo(userId);
        res.status(201).send(data);
    } catch(error) {
        res.status(500).json({ message: 'Can not get userData info', error: error.message});
    }
 
}

const allUsers= async (req, res)=> {
    
    try {
        const users= await getUsers();
        res.status(200).send(users);
    
    } catch(error) {
        res.status(500).json({ message: 'Can not get all users', error: error.message});
    }
}

const getUserInfoForBilling= async(req, res)=> {
    const { id }= req.user;
    const { userId }= req.query;
    try {
        const data= await getUserInfo(id, userId);
        res.status(200).json(data);

    } catch(error) {
        res.status(500).json({error: 'Error geting cuit & data for billing', message: error.message});
    }
}

const sendQueryByEmail= async (req, res)=> {
    const { nombre, empresa, email, tel, msg } = req.body;
    try {
        const sendMail= await sendMailContact(nombre, empresa, email, tel, msg);
        res.status(200).json({message:sendMail})

    } catch(error){
        res.status(500).json({error: 'Error sending query contact by mail', message: error.message});
    }
}

module.exports= { newUser, loginUser, logoutUser, allUsers, getUserData, getUserInfoForBilling, sendQueryByEmail }