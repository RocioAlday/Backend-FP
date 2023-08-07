const transporter = nodemailer.createTransport({
    service: 'gmail', // Cambia a tu proveedor de correo electrónico (ejemplo: 'Outlook')
    auth: {
        user: process.env.USER_GMAIL, // Cambia a tu dirección de correo electrónico
        pass: process.env.PASS_GMAIL, // Cambia a tu contraseña de correo electrónico
    },
});


module.exports= {
    transporter
}