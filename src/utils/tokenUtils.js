import jwt from 'jsonwebtoken';

export const generateAccessToken = async(user, options) =>
{
  return jwt.sign(
    {
      user: {
        ...user, password: undefined
      }
    },
    process.env.SECRET_ACCESS_TOKEN, options
  );
};

export const generateRefreshToken = async(user, options) =>
{
  return jwt.sign(
    {
      user: {
        ...user, password: undefined
      }
    },
    process.env.SECRET_REFRESH_TOKEN, options
  );
};

export const verifyAccessToken = async(token) =>
{
  return jwt.verify(token, process.env.SECRET_ACCESS_TOKEN);
};

export const verifyRefreshToken = async(token) =>
{
  return jwt.verify(token, process.env.SECRET_REFRESH_TOKEN);
};
