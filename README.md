# Microservicios con NestJS

## API-GATEWAY
Vamos a crear el primero proyecto que será nuestro ***API Gateway***, para eso ejecutamos el siguiente comando

```bash
$ npx nest new api-gateway

We will scaffold your app in a few seconds..

CREATE api-gateway/.eslintrc.js (665 bytes)
CREATE api-gateway/.prettierrc (51 bytes)
CREATE api-gateway/README.md (3340 bytes)
CREATE api-gateway/nest-cli.json (118 bytes)
CREATE api-gateway/package.json (1996 bytes)
CREATE api-gateway/tsconfig.build.json (97 bytes)
CREATE api-gateway/tsconfig.json (546 bytes)
CREATE api-gateway/src/app.controller.spec.ts (617 bytes)
CREATE api-gateway/src/app.controller.ts (274 bytes)
CREATE api-gateway/src/app.module.ts (249 bytes)
CREATE api-gateway/src/app.service.ts (142 bytes)
CREATE api-gateway/src/main.ts (208 bytes)
CREATE api-gateway/test/app.e2e-spec.ts (630 bytes)
CREATE api-gateway/test/jest-e2e.json (183 bytes)

# Seleccionamos npm
? Which package manager would you ❤️  to use? npm

✔ Installation in progress... ☕
```

Una vez que termine la instalacion, veremos algo como lo siguiente:

```bash
🚀  Successfully created project api-gateway
👉  Get started with the following commands:

$ cd api-gateway
$ npm run start

                          Thanks for installing Nest 🙏
                 Please consider donating to our open collective
                        to help us maintain this package.
                                         
                                         
               🍷  Donate: https://opencollective.com/nest
```

### Configuracion de App Modulo del proyecto API Gateway

Vamos a configurar el modulo de nuestra aplicacion y vamos a importar ahi nuestro archivo de variables de entorno

para eso creamos el archivo ***/api-gateway/.env.development*** con la siguiente informacion

##### .env.development
```bash
# API
APP_URL=https://superflights.com
APP_PORT=3000
```

Vamos al archivo ***/api-gateway/src/main.ts*** y cambiamos esta linea:

```javascript
await app.listen(3000);
```

por esta

```javascript
await app.listen(process.env.APP_PORT || 3000);
```

Con esa configuracion le decimos a la aplicacion que si existe la variable de entorno la utilice, caso contrario tome el puerto 3000 por defecto.

Ahora vamos a instalar nestjs config con el siguiente comando:

```bash
$ npm i @nestjs/config
```

Y vamos a nuestro archivo ***/api-gateway/src/app.module.ts*** para hacer las importaciones y configuraciones correspondientes para config module, para poder importar el archivo de variables de entorno.

##### src/app.module.ts
```javascript
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env.development'],
      isGlobal: true
    })
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```