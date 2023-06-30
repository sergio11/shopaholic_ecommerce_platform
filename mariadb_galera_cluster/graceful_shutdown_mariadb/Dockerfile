FROM mariadb:10.10
RUN apt update && apt install -y xinetd curl nano
COPY xinetd.d/mysqlchk /etc/xinetd.d/mysqlchk
COPY mysqlchk.mysql.sh /usr/bin/mysqlchk.mysql.sh
COPY run.sh /run.sh
COPY xinetd.conf /etc/xinetd.conf
RUN chmod +x /usr/bin/mysqlchk.mysql.sh
RUN awk -v inserted=0 '/^[a-z]/ { if ($2 + 0 == 9200) { inserted=1 }; if (inserted == 0 && $2 + 0 > 9200) { print "mysqlchk\t\t9200/tcp"; inserted=1 }; print $0 }' /etc/services > /tmp/services && mv /tmp/services /etc/services
EXPOSE 9200
# Entrypoint overload to catch the ctrl+c and stop signals
ENTRYPOINT ["/bin/bash", "/run.sh"]
RUN /usr/sbin/xinetd -f /etc/xinetd.conf &
CMD ["mariadbd"]