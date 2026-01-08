FROM mariadb:11.4

RUN sed -i 's/^bind-address\s*=.*/bind-address = 0.0.0.0/' \
    /etc/mysql/mariadb.conf.d/50-server.cnf

COPY init.sql /docker-entrypoint-initdb.d/

EXPOSE 3306
