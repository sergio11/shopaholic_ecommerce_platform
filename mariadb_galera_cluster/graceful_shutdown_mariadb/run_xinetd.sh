#!/bin/bash
echo "Waiting for MariaDB service before starting xinet daemon"
sleep 60
while ! mysqladmin ping -u monitor -pmonitor00 -h localhost; do
  sleep 1
done
echo "MariaDB node is available, starting xinetd ..." && /usr/sbin/xinetd -f /etc/xinetd.conf
