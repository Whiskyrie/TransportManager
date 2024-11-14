import * as nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'Gmail', // Pode ser outro serviço, como o Mailgun ou SendGrid
  auth: {
    user: process.env.EMAIL_USER, // E-mail do remetente
    pass: process.env.EMAIL_PASS, // Senha do e-mail do remetente
  },
});

// Função para enviar e-mail de recuperação de senha
export const sendPasswordResetEmail = async (to: string, token: string) => {
  const resetLink = `${process.env.CLIENT_URL}/reset-password?token=${token}`;

  const mailOptions = {
    from: process.env.EMAIL_USER, // Remetente
    to, // Destinatário
    subject: 'Redefinição de Senha',
    text: `Clique no link abaixo para redefinir sua senha:\n\n${resetLink}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`E-mail de redefinição enviado para: ${to}`);
  } catch (error) {
    console.error('Erro ao enviar e-mail:', error);
    throw new Error('Erro ao enviar e-mail de recuperação');
  }
};
