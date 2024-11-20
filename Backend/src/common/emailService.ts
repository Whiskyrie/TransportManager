import * as nodemailer from 'nodemailer';
import * as jwt from 'jsonwebtoken'; // Biblioteca para gerar o token de redefinição

// Configuração do transporte de e-mail (usando Gmail como exemplo)
const transporter = nodemailer.createTransport({
  service: 'Gmail', // Pode ser outro serviço, como Mailgun ou SendGrid
  auth: {
    user: process.env.EMAIL_USER, // E-mail do remetente (variáveis de ambiente)
    pass: process.env.EMAIL_PASS, // Senha do e-mail do remetente
  },
});

// Função para enviar e-mail de recuperação de senha
export const sendPasswordResetEmail = async (to: string) => {
  // Gerar o token de redefinição de senha
  const token = jwt.sign({ email: to }, process.env.JWT_SECRET_KEY || 'secreta', {
    expiresIn: '1h', // Expiração do token de 1 hora
  });

  // Criar o link de redefinição de senha com o token
  const resetLink = `${process.env.CLIENT_URL}/reset-password?token=${token}`;

  // Configurar as opções do e-mail
  const mailOptions = {
    from: process.env.EMAIL_USER, // Remetente
    to, // Destinatário
    subject: 'Redefinição de Senha',
    text: `Clique no link abaixo para redefinir sua senha:\n\n${resetLink}`,
  };

  try {
    // Enviar o e-mail
    await transporter.sendMail(mailOptions);
    console.log(`E-mail de redefinição enviado para: ${to}`);
  } catch (error) {
    console.error('Erro ao enviar e-mail:', error);
    throw new Error('Erro ao enviar e-mail de recuperação');
  }
};
