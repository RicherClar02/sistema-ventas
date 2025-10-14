export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método no permitido' });
  }

  const { email } = req.body;

  // Por ahora solo simulamos el envío
  console.log(`Enlace de recuperación para: ${email}`);
  
  // En una implementación real, aquí enviarías el email
  // con nodemailer y guardarías un token temporal en la BD

  res.status(200).json({ 
    message: 'Si el email existe, recibirás un enlace de recuperación' 
  });
}