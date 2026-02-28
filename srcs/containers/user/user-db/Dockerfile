FROM mariadb:11.4

COPY conf/my.cnf /etc/mysql/conf.d/my.cnf
COPY init.sql /docker-entrypoint-initdb.d/

EXPOSE 3306
