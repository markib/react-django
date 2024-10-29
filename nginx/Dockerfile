FROM nginx:stable-alpine

RUN rm /etc/nginx/conf.d/default.conf

COPY ./default.conf /etc/nginx/conf.d/default.conf

CMD [ "nginx-debug", "-g", "daemon off;" ]