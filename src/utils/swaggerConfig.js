import swaggerJSDoc from 'swagger-jsdoc';
/* Path */
import path from 'path';

const swaggerOptions = {
  definition:{
    openapi: '3.0.0',
    info: {
        title: 'Document API REST',
        description: 'API REST - Proyecto Backend CoderHouse'
    }
  },
  apis:[`${path.resolve()}/src/docs/**/*.yaml`]
};

export const specs = swaggerJSDoc(swaggerOptions);
