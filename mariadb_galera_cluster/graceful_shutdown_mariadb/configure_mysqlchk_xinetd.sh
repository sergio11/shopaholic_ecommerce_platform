#!/bin/bash
apt-get update && apt-get install telnet -y && apt-get install xinetd -y
awk -v inserted=0 '/^[a-z]/ { if ($2 + 0 == 9200) { inserted=1 }; if (inserted == 0 && $2 + 0 > 9200) { print "mysqlchk\t\t9200/tcp"; inserted=1 }; print $0 }' /etc/services > /tmp/services && mv /tmp/services /etc/services
/etc/init.d/xinetd start