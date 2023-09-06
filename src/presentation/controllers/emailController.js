import EmailManager from '../../domain/manager/emailManager.js';


const sendEmail = async(req, res, next) =>
{
  try
  {
    const { data, email, template } = req.body;

    const manager = new EmailManager();
    await manager.send(data, email, template);

    res.status(200).send({ status: 'success', message: 'Email has sended successfully' });
  }
  catch (e)
  {
		next(e);
	}
};

export { sendEmail };
