FROM ubuntu:16.04
RUN  apt-get update -y
RUN apt-get install keepalived nginx -y
COPY entrypoint.sh /entrypoint.sh
COPY keepalived.conf /etc/keepalived/keepalived.conf
COPY notify.sh /container/service/keepalived/assets/notify.custom.sh
RUN chmod +x /entrypoint.sh
RUN chmod +x /container/service/keepalived/assets/notify.custom.sh
CMD ["sh", "/entrypoint.sh"]