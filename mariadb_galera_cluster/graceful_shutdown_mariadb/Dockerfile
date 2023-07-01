FROM mariadb:10.10
RUN apt update && apt install -y xinetd curl nano
COPY xinetd.d/mysqlchk /etc/xinetd.d/mysqlchk
COPY xinetd/mysqlchk.mysql.sh /usr/bin/mysqlchk.mysql.sh
COPY xinetd/run_xinetd.sh /usr/bin/run_xinetd.sh
COPY xinetd/xinetd.conf /etc/xinetd.conf
COPY run.sh /usr/bin/run.sh
RUN chmod +x /usr/bin/mysqlchk.mysql.sh
RUN chmod +x /usr/bin/run_xinetd.sh
RUN chmod +x /usr/bin/run.sh
RUN awk -v inserted=0 '/^[a-z]/ { if ($2 + 0 == 9200) { inserted=1 }; if (inserted == 0 && $2 + 0 > 9200) { print "mysqlchk\t\t9200/tcp"; inserted=1 }; print $0 }' /etc/services > /tmp/services && mv /tmp/services /etc/services
EXPOSE 9200
# Entrypoint overload to catch the ctrl+c and stop signals
ENTRYPOINT ["/bin/bash", "/usr/bin/run.sh"]
CMD ["mariadbd"]