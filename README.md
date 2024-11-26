# NestJS API Template

This is a template for creating a robust NestJS API project. It includes essential packages and tools for development, testing, and production environments, ensuring a smooth development experience.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Scripts](#scripts)
- [Dependencies](#dependencies)
- [Development Guidelines](#development-guidelines)
- [Testing](#testing)
- [License](#license)

---

## Features

- **NestJS Framework**: Built using NestJS for a modular and scalable architecture.
- **Database Integration**: Supports TypeORM for database interactions.
- **Authentication**: Passport with JWT and local strategies for user authentication.
- **Logging**: Uses Winston for customizable and scalable logging.
- **Swagger Documentation**: Automatically generates API documentation with Swagger.
- **Supabase Integration**: Supports Supabase with its JavaScript client.
- **Validation**: Built-in validation using `class-validator`.
- **Day.js**: For date and time handling.
- **Testing**: Pre-configured for unit and end-to-end (e2e) tests with Jest.

---

## Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd nest-api-template
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Configure environment variables by creating a `.env` file in the root directory. Use `.env.example` as a template.

4. Start the application:

   ```bash
   npm run start:dev
   ```

---

## Scripts

The project includes a set of predefined scripts for common tasks:

- **Build**: Compile the application for production.

  ```bash
  npm run build
  ```

- **Development**: Start the development server with hot-reloading.

  ```bash
  npm run start:dev
  ```

- **Production**: Start the production server.

  ```bash
  npm run start:prod
  ```

- **Testing**:
  - Run all tests:

    ```bash
    npm test
    ```

  - Watch tests:

    ```bash
    npm run test:watch
    ```

  - Generate coverage report:

    ```bash
    npm run test:cov
    ```

- **Linting**: Lint and format code.

  ```bash
  npm run lint
  npm run format
  ```

---

## Dependencies

### Core

- `@nestjs/common`, `@nestjs/core`, `@nestjs/platform-express`: Core modules of the NestJS framework.
- `@nestjs/typeorm`: Database ORM integration.
- `class-validator`: For validating request data.
- `dayjs`: Lightweight library for date manipulation.

### Authentication

- `@nestjs/jwt`, `@nestjs/passport`: JWT-based authentication.
- `passport`, `passport-jwt`, `passport-local`: Strategies for authentication.

### Utilities

- `axios`: HTTP client for external API calls.
- `nestjs-slack`: Slack integration.
- `uuid`: Generate unique IDs.

### Logging

- `nest-winston`, `winston`, `winston-daily-rotate-file`: Logging with daily log file rotation.

---

## Development Guidelines

1. **Code Style**: Use Prettier for formatting and ESLint for linting. Ensure code passes checks before committing.

   ```bash
   npm run lint
   npm run format
   ```

2. **Folder Structure**:
   - `src`: Main application code.
   - `test`: Test files for unit and e2e testing.
   - `dist`: Compiled output (after building).

3. **Environment Variables**: Manage configuration using environment variables. Use `@nestjs/config` to load and validate configurations.

---

## Testing

This project uses Jest for testing. The configuration can be found in the `jest` section of the `package.json`.

- **Unit Tests**: Write unit tests for individual components.
- **e2e Tests**: Write integration tests for API endpoints.

Run all tests:

```bash
npm test
```

Generate coverage:

```bash
npm run test:cov
```

---

## License

This project is licensed as **UNLICENSED**. Please contact the author for usage permissions.

---

## Author

**Guillaume Duhan**  
**Company**: Allocations  

For queries, feel free to contact the author.