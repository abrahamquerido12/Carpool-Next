const nodemailer = require('nodemailer');

// function to send email verification

export const sendEmail = async (email: string, token: string) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.zoho.com',
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_ADDRESS,
      pass: process.env.EMAIL_PASS,
    },
  });

  // if env is dev base url will be localhost:3000
  // if env is prod base url will be env variable DOMAIN
  // path is /email-verification/{token}
  const baseUrl =
    process.env.NODE_ENV === 'production'
      ? process.env.DOMAIN
      : 'http://localhost:3000';
  const url = `${baseUrl}/email-verification/${token}`;

  const mailOptions = {
    from: process.env.EMAIL_ADDRESS,
    to: email,

    subject: 'Email Verification',
    html: `
    <p>Favor de hacer clic en el siguiente enlace para verificar su correo:</p>
    <a href="${url}">Verificar correo</a>
  `,
  };
  await transporter.sendMail(mailOptions);
  return;
};
