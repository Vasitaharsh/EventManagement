import nodemailer from 'nodemailer';

export class EmailService {
  private transporter;

  constructor() {
    console.log({
      service: 'gmail',
      secure:true,
      port: 465, 
      auth: {
        user: process.env.EMAIL_USER,
        pass:  process.env.EMAIL_PASS,
      },
    });
    
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      secure:true,
      port: 465, 
      auth: {
        user: 'harshvasita105@gmail.com',
        pass: 'dzirhonfshvokesy',
      },
    });
  }

  public async sendOtpEmail(to: string, otp: string): Promise<void> {
    console.log(process.env.EMAIL_USER);
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject: 'OTP for Registration',
      text: `Your OTP code is ${otp}`,
    };
    
    await this.transporter.sendMail(mailOptions);
   
  } 
  public async sendEmail(to: string, subject: string, html: string): Promise<void> {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      text: html,
    };

    await this.transporter.sendMail(mailOptions);
  }
}
