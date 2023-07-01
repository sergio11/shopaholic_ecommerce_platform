#!/bin/bash
echo "Waiting for MariaDB service before starting xinet daemon"
sleep 120
while ! mysqladmin ping -u monitor -pmonitor00 --silent; do
  sleep 1
done
echo "MariaDB node is available, starting xinetd ..." && /usr/sbin/xinetd -f /etc/xinetd.conf
