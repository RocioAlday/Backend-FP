const { User }= require('../db');
const { hashPassword }= require('../config/hashPassword');
const { generateRefreshToken }= require('../config/generateRefreshToken');

const userCreation= async(companyName, firstname, lastname, email, phone, image, password, status)=> {
    const user= await User.findOne({ where : { email: email } });
    if (user) throw new Error ('This e-mail is already in use, please use another email');

    const userCreate= await User.create({
        companyName,
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

    if (findUser && await findUser.passwordMatched(findUser.password, password)) {
        const newToken= generateRefreshToken(findUser.id);
        const updateUser= await findUser.update({refreshToken: newToken});
        
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
}

module.exports= { userCreation, userLogin, logOutUserCtr };