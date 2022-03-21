import nodemailer from 'nodemailer';

class MailService {

    constructor() {
        this.transported = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            secure: false,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASSWORD
            }
        })
    }

    async sendRendRecoveryLink(to, link, declineLink) {

        console.log(link, declineLink)
        await this.transported.sendMail({
            from: process.env.SMTP_USER,
            to,
            subject: "Recovery your password on " + process.env.CLIENT_URL,
            text: '',
            html:
                `<div><h2><p style="text-indent: 20px;">Hey, <mark style="color:#4caf50; background:none">${to}</mark>, you get it message because forgot password. If it was isnt you please press <u>"Im not sure"</u> button and contact administator.</p></h2><div style="justify-content: space-around; display: flex;"><div><a style="background-color: #4caf50; cursor: pointer; border-radius: 5px; border: none; color: white; padding: 15px 32px; text-align: center; text-decoration: none; display: inline-block; font-size: 16px;" href="${link}" > Yes, im sure </a></div> <div><a style="background-color: #4caf50; margin: 0 10px; cursor: pointer; border-radius: 5px; border: none; color: white; margin: 0 10px; padding: 15px 32px; text-align: center; text-decoration: none; display: inline-block; font-size: 16px;" href="${declineLink}" > Im not sure </a></div></div></div>`
        })
    }
}

export default new MailService();