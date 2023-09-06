import AppExpress from '../app/appExpress.js';


class AppFactory
{
  static create(appType = 'AppExpress')
  {
    const apps = new Map();
    apps.set('AppExpress', AppExpress);

    if (!apps.has(appType)) throw Error('AppAdapter not found');

    const app = apps.get(appType);
    return new app();
  }
}

export default AppFactory;
