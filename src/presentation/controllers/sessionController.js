import SessionManager from '../../domain/manager/sessionManager.js';
/* Config */
import { configCookiesLogin, configCookiesRefresh } from '../../config/index.js';


const login = async(req, res, next) =>
{
  try
  {
    const { email, password } = req.body;

    const manager = new SessionManager();
    const userLogued = await manager.login(email, password);

    const { payload, newTkn, refreshTkn } = userLogued;

    res
    .cookie('refreshToken', refreshTkn, configCookiesLogin)
    .status(200)
    .send({ status: 'success', message: 'Login success!', user: payload, token: newTkn });
  }
  catch (error)
  {
    next(error);
  }
};

const current = async(req, res, next) =>
{
  try
  {
    const { email, password } = req.body;

    const manager = new SessionManager();
    const userCurrent = await manager.current(email, password);

    res.status(200).send({ status: 'success', user: { ...userCurrent, password: undefined } });
  }
  catch (error)
  {
    next(error);
  }
};

const register = async(req, res, next) =>
{
  try
  {
    const manager = new SessionManager();
    const user = await manager.register(req.body);

    res.status(201).send({ status: 'success', user, message: 'User created.' });
  }
  catch (error)
  {
    next(error);
  }
};

const logout = async(req, res, next) =>
{
  try
  {
    const { token } = req.params;

    const manager = new SessionManager();
    const newToken = await manager.logout(token);

    res.clearCookie('accesToken');
    res.status(200).send({ status: 'success', message: 'Logout success!', token: newToken });
  }
  catch (error)
  {
    next(error);
  }
};

const forgotPassword = async(req, res, next) =>
{
  try
  {
    const { email } =  req.body;

    const manager = new SessionManager();
    await manager.forgotPassword(email);

    res.status(201).send({ status: 'success', message: 'Email was send.' });
  }
  catch (error)
  {
    next(error);
  }
};

const resetPassword = async(req, res, next) =>
{
  try
  {
    const { password } =  req.body;
    const { token } =  req.params;

    const manager = new SessionManager();
    await manager.resetPassword(password, token);

    res.status(201).send({ status: 'success', message: 'Password was changed.' });
  }
  catch (error)
  {
    next(error);
  }
};

const refreshToken = async(req, res, next) =>
{
  try
  {
    const cookies = req.cookies;

    if (!cookies?.refreshToken) return res.status(401).send({ status: 'error', message: 'Unauthorized.' });

    const refreshToken = cookies.refreshToken;

    const manager = new SessionManager();
    const tokens = await manager.refreshToken(refreshToken);

    if (!tokens.newAccessToken) return res.status(403).send({ status: 'error', message: 'No token provided.' });

    const {  newAccessToken, newRefreshToken } = tokens;

    return res
    .cookie('refreshToken', newRefreshToken, configCookiesRefresh)
    .status(200)
    .send({ status: 'success', token: newAccessToken });
  }
 catch (error)
  {
    next(error);
  }
};


export { login, register, current, logout, forgotPassword, resetPassword, refreshToken };
