import bcrypt from 'bcryptjs';

const createHash = async(password, salt) =>
{
  return await bcrypt.hash(password.toString(), salt);
};

const comparePass = async(passPlain, passHash) =>
{
  return await bcrypt.compare(passPlain.toString(), passHash);
};

export { createHash, comparePass };
