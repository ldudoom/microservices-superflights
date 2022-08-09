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
