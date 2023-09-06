import nodemailer from 'nodemailer';
import path, { resolve } from 'path';
import fs from 'fs';
import Handlebars from 'handlebars';

class EmailService
{
  constructor()
  {
    this.service_config = {
      service: process.env.SMTP_SERVICE,
      port: process.env.PORT,
      auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_KEY
      }
    };
  }

  async create()
  {
    return nodemailer.createTransport(this.service_config);
  }

  async sendEmail(data, email, templateEmail)
  {
    const transport = await this.create();

    const templatePath = path.join(process.cwd(), `src/presentation/templates/${templateEmail}.hbs`);
    // const templatePath = resolve(`src/presentation/templates/${templateEmail}.hbs`);
    const source = fs.readFileSync(templatePath).toString();
    const template = Handlebars.compile(source);

    const html = template(data);

    const mail_config = {
      from: process.env.SMTP_EMAIL,
      to: email,
      html
    };

    await transport.sendMail(mail_config);
  }
}


export default EmailService;
