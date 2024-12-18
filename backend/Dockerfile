# Use the official Python slim image as a base
FROM python:3.11-slim as builder

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Install dependencies for building the app
RUN apt-get update && apt-get install -y \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Set the working directory
WORKDIR /app

# Copy the Django project code
COPY . /app

# Install Python dependencies
RUN python3 -m venv /opt/venv && \
    /opt/venv/bin/pip install --upgrade pip && \
    /opt/venv/bin/pip install -r requirements.txt && \
    chmod +x /app/entrypoint.sh

CMD [ "/app/entrypoint.sh" ]    
# Expose the port the app runs on
# EXPOSE 8000

# Use gunicorn for production
# CMD ["gunicorn", "core.wsgi:application", "--bind", "0.0.0.0:8000" ,"--reload"]

