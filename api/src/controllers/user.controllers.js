const { User }= require('../db');
const { hashPassword }= require('../config/hashPassword');
const { generateRefreshToken }= require('../config/generateRefreshToken');
const { authMiddleware }= require('../middlewares/authToken');

const userCreation= async(companyName, companyCUIT, taxCondition, firstname, lastname, email, phone, image, password, status)=> {
    const user= await User.findOne({ where : { email: email } });
    if (user) throw new Error ('This e-mail is already in use, please use another email');

    const userCreate= await User.create({
        companyName,
        companyCUIT,
        taxCondition,
        firstname,
        lastname,
        email,
        phone,
        image,
        password,
        status
    });

    const hashPass= await hashPassword(userCreate); 
    const finalUser= await userCreate.update({ password: hashPass });

    return finalUser.dataValues;
};

const userLogin= async (email, password)=> {
    const findUser= await User.findOne({ where: { email: email } });
    console.log(findUser);
    console.log(await findUser.passwordMatched(findUser.password, password));

    if (findUser && await findUser.passwordMatched(findUser.password, password)) {
        const newToken= generateRefreshToken(findUser.id);
        const updateUser= await findUser.update({refreshToken: newToken});
        console.log(updateUser.dataValues);
        return updateUser.dataValues;

    } else {
        throw new Error ('Invalid Credentials')
    }
};

const logOutUserCtr= async (token) => {
    const user= await User.findOne( {where: { refreshToken: token }});
    if(user) {
       await user.update({
        refreshToken: ""
       });

       return user.id;
    }
};

const getUsers= async()=> {
    const users= await User.findAll();
    return users;
}

const getUserInfo= async(userId)=> {
    const user= await User.findByPk(userId);
    const dataUser= {
        name: user.companyName,
        cuit: user.companyCUIT,
        condicionImpositiva: user.taxCondition
    };
    return dataUser;
}

module.exports= { userCreation, userLogin, logOutUserCtr, getUsers, getUserInfo };