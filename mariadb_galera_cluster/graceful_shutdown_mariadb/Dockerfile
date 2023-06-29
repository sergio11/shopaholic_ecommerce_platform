FROM mariadb:10.10

COPY signal-listener.sh /run.sh
COPY configure_mysqlchk_xinetd.sh /configure_mysqlchk_xinetd.sh
COPY mysqlchk.mysql.sh /mysqlchk.mysql.sh
COPY mysqlchk /etc/xinetd.d/mysqlchk
COPY xinetd.conf /etc/xinetd.conf

RUN chmod +x /configure_mysqlchk_xinetd.sh
RUN ./configure_mysqlchk_xinetd.sh
# Entrypoint overload to catch the ctrl+c and stop signals
ENTRYPOINT ["/bin/bash", "/run.sh"]
CMD ["mariadbd"]