const bcrypt= require('bcrypt');

const hashPassword= async (user)=> {
    const salt= await bcrypt.genSaltSync(10);
    user.password= bcrypt.hashSync(user.password, salt);

    return user.password;
};

module.exports= {
    hashPassword
}