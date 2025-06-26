FROM postgres:15

# Set environment variables for the default database, user, and password
ENV POSTGRES_DB=tracedb \
    POSTGRES_USER=traceuser \
    POSTGRES_PASSWORD=tracepass

# Expose PostgreSQL port
EXPOSE 5432

COPY ./init.sql /docker-entrypoint-initdb.d/