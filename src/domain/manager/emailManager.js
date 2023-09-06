import EmailService from '../../presentation/services/emailService.js';

class EmailManager
{
  constructor()
  {
    this.emailService = new EmailService();
  }

  async send(data, email, template)
  {
    await this.emailService.sendEmail(data, email, template);
  }
}

export default EmailManager;
