import container from '../../container.js';
/* Service */
import EmailService from '../../presentation/services/emailService.js';
/* Utils */
import { establishedRole } from '../../utils/establishedRole.js';
/* Bcrypt */
import { createHash, comparePass } from '../../utils/handleBcrypt.js';
/* Zod */
import { userLoginValidation, userRegisterValidation } from '../validations/session/sessionValidation.js';
import { userIsActive, userUpdateValidation } from '../validations/user/userValidation.js';
/* Jwt */
import { generateAccessToken, generateRefreshToken, verifyRefreshToken, verifyAccessToken } from '../../utils/tokenUtils.js';
/* Config */
import { FRONT } from '../../config/index.js';

class SessionManager
{
  constructor()
  {
    this.userRepository = container.resolve('UserRepository');
    this.blackListRepository = container.resolve('BlackListRepository');
    this.emailService = new EmailService();
  }

  async login(email, password)
  {
    await userLoginValidation.parseAsync({ email, password });

    const getUser = await this.userRepository.getOne({ email });
    if (!getUser) throw new Error(`The user with email:${email} doesn't exist.`);

    const { id, firstName, enable } = getUser;
    // cron
    await userIsActive.parseAsync({ enable });

    const isHashedPassword = await comparePass(password, getUser.password);
    if (!isHashedPassword) throw new Error('Login failed, invalid password.');

    const newTkn = await generateAccessToken(getUser, { expiresIn: '30m' });
    const refreshTkn = await generateRefreshToken(getUser,  { expiresIn: '1h' });

    await this.userRepository.update(id, { last_connection: new Date() });

    const payload = {
      id,
      firstName,
      email
    };

    return {
      payload,
      newTkn,
      refreshTkn
    };
  }

  async register(data)
  {
    await userRegisterValidation.parseAsync(data);

    const { firstName, lastName, age, email, password } = data;

    const isUser = await this.userRepository.getOne({ email });
    if (isUser) throw new Error(`The user with email => "${email}", already exist.`);

    const idRole = await establishedRole('client');
    data.role = idRole;

    const payload = {
      firstName,
      lastName,
      age,
      email,
      password: await createHash(password, 10),
      role: idRole
    };

    const user = await this.userRepository.create(payload);

    return { ...user, password: undefined };
  }

  async current(email, password)
  {
    await userLoginValidation.parseAsync({ email, password });

    const getUser = await this.userRepository.getOne({ email });
    if (!getUser) throw new Error(`The user with email:${email} doesn't exist.`);

    const { id, role, enable, ...rest } = getUser;

    // cron
    await userIsActive.parseAsync({ enable });

    const isHashedPassword = await comparePass(password, getUser.password);
    if (!isHashedPassword) throw new Error('Login failed, invalid password.');

    return { ...rest, role: role.name, password: undefined };
  }


  async logout(token)
  {
    const getToken = await this.blackListRepository.getOne(token);
    if (getToken) throw new Error('You have already logged out.');

    const blackList = await this.blackListRepository.create({ token });
    if (!blackList) throw new Error('Failed to log out correctly.');

    const { user } = await verifyAccessToken(token);

    const tokenLogout = await generateAccessToken(user, { expiresIn: '0s' });

    await this.userRepository.update(user.id, { last_connection: new Date() });

    return tokenLogout;
  }

  async forgotPassword(email)
  {
    await userUpdateValidation.parseAsync({ email });

    const getUser = await this.userRepository.getOne({ email });
    if (!getUser) throw new Error(`The user with email:${email} doesn't exist.`);

    const token = await generateAccessToken(getUser, { expiresIn: '300s' });

    await this.emailService.sendEmail({ link: `${FRONT}/resetpassword/${token}` }, email, 'forgotPassword');

    return { ...getUser, password: undefined };
  }

  async resetPassword(password, token)
  {
    await userUpdateValidation.parseAsync({ password });

    const { user } = await verifyAccessToken(token);

    if (!user.email) throw new Error('The user is invalid.');

    const newPassword = { password: await createHash(password, 10) };

    const userUpdated = await this.userRepository.update(user.id, newPassword);

    return { ...userUpdated, password: undefined };
  }

  async refreshToken(token)
  {
    const { user } = await verifyRefreshToken(token);

    const newAccessToken = await generateAccessToken(
      {
        ...user
      },
      {
        expiresIn: '30m'
      }
    );

    const newRefreshToken = await generateRefreshToken(
      {
        ...user
      },
      {
        expiresIn: '1h'
      }
    );

    return { newAccessToken, newRefreshToken };
  }
}

export default SessionManager;
