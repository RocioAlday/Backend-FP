const { User }= require('../db');

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
    return userCreate;
}

module.exports= { userCreation };