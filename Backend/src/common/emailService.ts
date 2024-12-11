import * as nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const emailService = {
  
  async sendResetPasswordEmail(email: string, resetCode: string): Promise<void> {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,  
      subject: 'Código de Redefinição de Senha',
      text: `Seu código de redefinição de senha é: ${resetCode}\n\nEste código é válido por 10 minutos.`,
    };

    try {
      await transporter.sendMail(mailOptions);
      console.log(`E-mail de redefinição enviado para: ${email}`);
    } catch (error) {
      console.error('Erro ao enviar e-mail:', error);
      throw new Error('Erro ao enviar e-mail de recuperação');
    }
  },
};
