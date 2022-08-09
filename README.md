# MICROSERVICIOS CON NESTJS

## API-GATEWAY
***
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



***
### CONFIGURACION DE APP MODULE
***

Vamos a configurar el modulo de nuestra aplicacion y vamos a importar ahi nuestro archivo de variables de entorno

para eso creamos el archivo ***/api-gateway/.env.development*** con la siguiente informacion

##### **.env.development**
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

##### **src/app.module.ts**
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


***
### EXCEPCI&Oacute;N GLOBAL
***

Para esto vamos a crear los directorios:
- /api-gateway/src/common
- /api-gateway/src/common/filters

Y dentro del directorio ***/api-gateway/src/common/filters*** vamos a crear el archivo:

- /api-gateway/src/common/filters/http-exceptions.filter.ts

Y colocaremos en este archivo el siguiente codigo:

##### **api-gateway/src/common/filters/http-exceptions.filter.ts**
```javascript
import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Logger } from "@nestjs/common";

@Catch()
export class AllHttpExceptionsFilter implements ExceptionFilter
{

    private readonly logger = new Logger(AllHttpExceptionsFilter.name);

    catch(exception: any, host: ArgumentsHost) {
        const context = host.switchToHttp();
        const response = context.getResponse();
        const request = context.getRequest();

        const status = exception instanceof HttpException 
                       ? exception.getStatus() 
                       : HttpStatus.INTERNAL_SERVER_ERROR;

        const message = exception instanceof HttpException
                        ? exception.getResponse()
                        : exception;

        this.logger.error(`Status ${status} Error ${JSON.stringify(message)}`);

        response.status(status).json({
            time: new Date().toISOString(),
            path: request.url,
            error: message
        });
    }

}
```

Por ultimo, dejamos al archivo ***/src/main.ts*** como se muestra a continuacion:

##### **api-gateway/src/main.ts**
```javascript
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AllHttpExceptionsFilter } from './common/filters/http-exceptions.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new AllHttpExceptionsFilter());
  await app.listen(process.env.APP_PORT || 3000);
}
bootstrap();
```
***
### INTERCEPTOR GLOBAL
***
Ahora vamos a implementar el interceptor global, para eso vamos a realizar la siguiente configuración:

Primero vamos a crear el siguiente directorio:

- /api-gateway/src/common/interceptors

Ahora vamos a crear el archivo 

- /api-gateway/src/common/interceptors/timeout.interceptor.ts

y colocaremos el siguiente codigo dentro de este archivo

##### **api-gateway/src/common/interceptors/timeout.interceptor.ts**
```javascript
import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { Observable } from "rxjs";
import { timeout } from 'rxjs/operators';

@Injectable()
export class TimeoutInterceptor implements NestInterceptor
{
    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
        return next.handle().pipe(timeout(120000));
    }

}
```

Por último, configuramos este interceptor en nuestro ***main.js***
##### **api-gateway/src/main.ts**
```javascript
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AllHttpExceptionsFilter } from './common/filters/http-exceptions.filter';
import { TimeoutInterceptor } from './common/interceptors/timeout.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new AllHttpExceptionsFilter());
  app.useGlobalInterceptors(new TimeoutInterceptor());
  await app.listen(process.env.APP_PORT || 3000);
}
bootstrap();
```
***

### INSTALACION DE DEPENDENCIAS
***
Ahora vamos a instalar las dependencias necesarias construir nuestro **API GATEWAY**.

Las dependencias que vamos a instalar son:

- amqplib -> Para utilizar RabbitMQ
- amqp-connection-manager
- class-validator
- class-transformer 
- @nestjs/microservices

```bash
$ npm i amqplib amqp-connection-manager class-validator class-transformer @nestjs/microservices
```


***
