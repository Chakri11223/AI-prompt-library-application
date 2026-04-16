# AI Image Generation Prompts Library

This is a full-stack library application to manage AI Image Generation Prompts. It uses Django for the backend, Angular for the frontend, and relies on PostgreSQL and Redis.

## Architecture

- **Backend**: Python (Django + Psycopg2 + Redis client). We chose native Django views over DRF following the requirements. Django serves as the business logic handler containing the application's single `Prompt` model.
- **Frontend**: Angular 16 application styled explicitly with premium custom CSS (Dark UI Glassmorphism architecture + inter font families).
- **Database**: PostgreSQL handles persistent record storage. 
- **Caching/Counter**: Redis acts as a fast in-memory store representing the single source of truth for the `view_count` on the `Prompt` details endpoint, which guarantees high throughput.

## Setup Instructions

The application is fully containerized. You will need [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed on your machine.

1. **Clone this repository** (or navigate to `project1`):
   ```bash
   cd project1
   ```

2. **Start the application with Docker Compose**:
   ```bash
   docker-compose up --build
   ```
   **Note**: The backend entrypoint script (`entrypoint.sh`) is configured to wait for PostgreSQL to become available and then automatically run Django database migrations (`python manage.py makemigrations` and `migrate`), seamlessly bootstrapping the tables.

3. **Access the application**:
   - **Frontend**: Go to [http://localhost:4200](http://localhost:4200) in your browser.
   - **Backend API**: Running on [http://localhost:8000/api/prompts/](http://localhost:8000/api/prompts/)

4. **Shutdown the application**:
   ```bash
   docker-compose down
   ```

## Development and Source Code
If developing locally without Docker, simply initialize a python `venv` in the `/backend` folder, install `requirements.txt`, setup a `.env` configuring local postgres instance, and run standard `python manage.py runserver`.
For modern frontend work, ensure you have `/frontend` packages via `npm install` and run `ng serve`.
