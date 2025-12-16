FROM nginx:latest

RUN apt-get update && apt-get install -y --no-install-recommends \
    openssl

# Create self-signed certificate
RUN mkdir -p /etc/ssl/certs /etc/ssl/private \
    && openssl req -x509 -nodes -days 365 \
        -subj "/CN=transcendence" \
        -newkey rsa:2048 \
        -keyout /etc/ssl/private/transcendence.key \
        -out /etc/ssl/certs/transcendence.crt

COPY ./conf/nginx.conf /etc/nginx/conf.d/

COPY ./html/index.html /usr/share/nginx/html/index.html
#aqui copiaba mi html personalizado a la carpeta 'html' para que el contenedor pueda acceder
#COPY html/ /var/www/martalop.42.fr/
# y le daba permisos al usuario de FPM (www-data) para poder leerlo luego sin haberlo creado 
#RUN chown -R www-data:www-data /var/www/martalop.42.fr

EXPOSE 443

# Start NGINX in foreground
#CMD ["nginx", "-g", "daemon off;"]
