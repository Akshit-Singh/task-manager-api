const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeEmail = (email, name)=>{
    sgMail.send({
        to: email,
        from: 'singh.dude7@gmail.com',
        subject: 'Thanks for joining in!',
        text: `Welcome to the app, ${name}.`
    })
}

const sendCancelationEmail = (email, name)=>{
    sgMail.send({
        to: email,
        from: 'singh.dude7@gmail.com',
        subject: 'Goodbye',
        text: `Thankyou, ${name} for using our app!`
    })
}

module.exports = {
    sendWelcomeEmail,
    sendCancelationEmail
}