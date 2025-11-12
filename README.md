<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

# AdestraPet API

## Description

Backend API developed in [NestJS](https://github.com/nestjs/nest) for the AdestraPet project. This video lesson platform allows users to register and authenticate to gain exclusive access to pet training content.

## Stack

- **Language:** TypeScript
- **Framework:** NestJS
- **ORM:** TypeORM
- **Database:** PostgreSQL
- **Containers:** Docker & Docker Compose.
- **Security:** BCryptjs, JWT.
- **CI/CD Tools:** Woodpecker CI

## Project setup

1 - Install the necessary dependencies:
```bash
$ npm install
```

2 - Copy the `.env.example` file, rename it to `.env`, and fill in the necessary environment variables.

3 - Run the docker-compose command:
```bash
$ docker compose up -d
```

4 - Run the migrations command:
```bash
$ npm run typeorm migration:run
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests (Pending development...)

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).

## Endpoints

### Auth Module

| Método        | URL             | Description |
| ------------- | --------------- | ----------- |
| POST          | /auth/login     | Uses email and password to log-in. |

### User Module

| Método        | URL             | Description |
| ------------- | --------------- | ----------- |
| POST          | /user           | Registers a user. |
| GET           | /user           | Lists all users (with pagination). |
| GET           | /user/details   | Retrieves user data. |
| PATCH         | /user           | Updates user data. |
| DELETE        | /user           | Deletes a user (soft delete). |

### Lesson Module

| Método        | URL             | Description |
| ------------- | --------------- | ----------- |
| POST          | /lesson         | Creates a lesson. |
| GET           | /lesson         | Lists all lessons (with pagination and filters). |
| GET           | /lesson/{id}    | Searches for lessons by ID. |
| PATCH         | /lesson/{id}    | Edits lesson data. |
| DELETE        | /lesson/{id}    | Deletes a lesson (soft delete). |

### Lesson Progress Module

| Método        | URL                         | Description |
| ------------- | --------------------------- | ----------- |
| POST          | /lesson-progress            | Saves user progress. |
| GET           | /lesson-progress/mine       | Lists all user lessons (with pagination). |
| GET           | /lesson-progress/favorites  | Lists all of the user's favorite lessons. |
| DELETE        | /lesson-progress/{lessonId} | Deletes the user's progress for a lesson. (soft delete). |
