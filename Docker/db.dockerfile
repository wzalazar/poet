FROM library/postgres
ENV POSTGRES_USER poet
ENV POSTGRES_PASSWORD poet
ENV POSTGRES_DB poet
RUN ["sed", "-i", "s/#log_statement = 'none'/log_statement = 'all'/gi", "/var/lib/postgres/postgresql.conf"]
