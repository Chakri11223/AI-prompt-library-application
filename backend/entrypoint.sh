#!/bin/bash

# Wait for database
echo "Waiting for PostgreSQL to start..."
while ! nc -z $DB_HOST 5432; do
  sleep 0.1
done
echo "PostgreSQL started"

# Apply database migrations
echo "Apply database migrations"
python manage.py makemigrations prompts
python manage.py migrate

# Start server
echo "Starting server"
python manage.py runserver 0.0.0.0:8000
