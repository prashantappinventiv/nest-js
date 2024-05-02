// import { ValidationPipe } from '@nestjs/common';
// import { ConfigService } from '@nestjs/config';
// import { HttpAdapterHost, NestFactory } from '@nestjs/core';
// import * as express from 'express';
// import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
// import { AppModule } from './app.module';
// import { AllExceptionsFilter } from './filters/exceptionFilter';
// import { LoggerMiddleware } from './interceptor/logging.middleware';
// import { MicroserviceOptions, Transport } from '@nestjs/microservices';
// import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
// import { CONSTANT, PROTO, Swagger } from './common/constant';
// import { join } from 'path';

// async function bootstrap() {
//   // Create the NestJS application
//   const app = await NestFactory.create(AppModule);
//   app.enableShutdownHooks(); // Enable shutdown hooks to gracefully handle shutdown

//   // Use express middleware to parse JSON requests and store the raw request body
//   app.use(
//     express.json({
//       verify: (req: any, res, buf) => {
//         req.rawBody = buf;
//       },
//     }),
//   );

//   // Use global validation pipe for automatic input validation
//   app.useGlobalPipes(
//     new ValidationPipe({
//       transform: true,
//       transformOptions: { enableImplicitConversion: true },
//     }),
//   );

//   // Enable CORS for the application
//   app.enableCors();

//   // Use custom logger middleware and set up Winston logger
//   app.use(new LoggerMiddleware().use);
//   app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));

//   // Get the HTTP adapter to use in global exception filters
//   const httpAdapter = app.get(HttpAdapterHost);
//   app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));

//   // Get the configuration service to retrieve environment variables
//   const configService = app.get(ConfigService);

//   // Retrieve the HTTP port from the configuration or use a default value
//   const nestPort: number = configService.get<number>('PORT') || 8001;
//   console.log("port is",nestPort)

//   const config = new DocumentBuilder()
//     .setTitle(Swagger.Title)
//     .setDescription(Swagger.Description)
//     .setVersion(Swagger.Version)
//     .addApiKey(
//       {
//         type: 'apiKey',
//         name: Swagger.AddApiKey.Name,
//         in: Swagger.AddApiKey.In,
//       },
//       Swagger.AuthType,
//     )
//     .addBearerAuth()
//     .build();

//   const document = SwaggerModule.createDocument(app, config);
//   SwaggerModule.setup(Swagger.Path, app, document);

//   // Start the NestJS application
//   await app.listen(nestPort);
//   console.info(`Nest server listening on Port: ${nestPort}`);

//   // GRPC connection setup starts here

//   // Retrieve the GRPC port from the configuration or use a default value
//   const grpcPort: number = configService.get<number>('GRPC_PORT') || 7001;
//   // Create a NestJS microservice for GRPC with specified options
//   const grpcServer = await NestFactory.createMicroservice<MicroserviceOptions>(
//     AppModule,
//     {
//       transport: Transport.GRPC,
//       options: {
//         url: `localhost:${grpcPort}`,
//         package: PROTO.PACKAGE_NAME,
//         protoPath: join(__dirname, CONSTANT.PROTO_FILE_PATH('user.proto')),
//         loader: {
//           keepCase: true,
//           longs: String,
//           enums: String,
//           defaults: true,
//           oneofs: true,
//         },
//         keepalive: {
//           keepaliveTimeoutMs: 5000,
//           keepaliveTimeMs: 10000,
//           keepalivePermitWithoutCalls: 1,
//           http2MaxPingsWithoutData: 0,
//         },
//       },
//     },
//   );

//   // Start the GRPC microservice
//   await grpcServer.listen();
//   console.log(`gRPC server listening on Port: ${grpcPort}`);
// }

// // Call the bootstrap function to start the application
// bootstrap();
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import * as cookieParser from 'cookie-parser';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { AppModule } from './app.module';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  app.connectMicroservice({
    transport: Transport.GRPC,
    options: {
      // package: AUTH_PACKAGE_NAME,
      // protoPath: join('/home/sky/Desktop/SONNY-CRM-PROJECT/auth/auth.proto'),
      // url: 'localhost:5002',
    },
  });
  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  // app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER))
  //  app.useLogger(app.get(Logger));
  // await app.startAllMicroservices();
  const port = configService.get('HTTP_PORT')
  await app.listen(port);
}
bootstrap();
