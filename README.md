# Proyecto Final Backend - Ecommerce
***
### Descripción
***
En este emocionante proyecto, hemos explorado y aplicado los conceptos fundamentales para la programación backend.
A lo largo de este curso, hemos adquirido un profundo conocimiento sobre la creación de aplicaciones **___robustas y escalables___** desde cero. Desde la configuración de un servidor con **Node.js** hasta la gestión eficiente de **___bases de datos NoSQL___** con **MongoDB**.

### Características Destacadas:
***
- Desarrollo de servidores web con Node.js y Express.
- Integración de bases de datos NoSQL utilizando MongoDB.
- Implementación de patrones de diseño para optimizar la arquitectura del proyecto.
- Creación de APIs RESTful para interacción cliente-servidor.
- Optimización de rendimiento y seguridad.
- Documentación clara y detallada.

### Principales Tecnologías Utilizadas:
***
- Express
- Mongoose

> Se utilizaron variedad de tecnolgias y bibliotecas como lo son: **Jsonwebtoken (JWT)**, **Bcryptjs**, **Swagger**, **Commander**, **Handlebars**, **Zod**, etc. Lo importante está en el formato del proyecto y como se implementó cada una de estas para formar, como dije antes, una aplicación robusta y sobre todo escalable.

### Estructura del proyecto
***

```sh 
├── Data
│   ├── Factories
│   ├── Models
│   └── Repositories
├── Domain
│   ├── Entities
│   ├── Manager
│   └── Validations
├── Presentation
│   ├── App
│   ├── Commands
│   ├── Controllers
│   ├── Factories
│   ├── Middlewares
│   ├── Routes
│   └── Services
│   └── Tempaltes
├── Tests
│   ├── Integrations
│   ├── Unitaries
 ```


### Comandos
***

### Creación de usuarios

```bash
npm run command -- addUser -fn admin -ln admin -a 19 -e admin@admin.com -p admin1234 -r admin
```

### Creación de Roles

```bash
npm run command -- addRoles
```