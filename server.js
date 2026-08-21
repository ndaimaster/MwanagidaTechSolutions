const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const rateLimit = require('express-rate-limit');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// Serve static frontend files if hosted together
app.use(express.static(path.join(__dirname)));

// Security: Prevent spam
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 5, 
  message: { success: false, message: 'Too many requests, please try again later.' }
});
app.use('/api/contact', limiter);

app.get('/api/services', (req, res) => {
  const defaultServices = [
    { title: "Website Development", desc: "Responsive, ultra-fast websites engineered to showcase your brand." },
    { title: "Networking Solutions", desc: "Reliable setup, configuration, and maintenance for home and business networks." },
    { title: "Business Applications", desc: "Custom software tailored to solve unique operational bottlenecks." },
    { title: "Web Applications", desc: "Full-stack web applications with scalable backend architectures." },
    { title: "Excel Systems & Automation", desc: "Transform messy spreadsheets into automated dashboards and custom VBA systems." }
  ];
  res.json(defaultServices);
});

app.post('/api/contact', async (req, res) => {
  const { name, email, phone, service, message } = req.body;

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'ndaiaugustino2005@gmail.com',         
      pass: 'abcdefghijklmnop' // <-- Put your 16-character Google App Password here
    }
  });

  const mailOptions = {
    from: 'ndaiaugustino2005@gmail.com',
    to: 'ndaiaugustino2005@gmail.com',
    replyTo: email,
    subject: `New Application/Appointment: ${service} from ${name}`,
    text: `New submission via Mwanagida Tech Solutions!\n\nName: ${name}\nEmail: ${email}\nPhone Number: ${phone}\nService: ${service}\n\nNotes:\n${message}`
  };

  try {
    await transporter.sendMail(mailOptions);
    res.json({ success: true, message: 'Application sent successfully!' });
  } catch (error) {
    console.error('Email error:', error);
    res.status(500).json({ success: false, message: 'Failed to send application.' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});