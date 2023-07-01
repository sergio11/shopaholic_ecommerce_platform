#!/bin/bash
echo "Waiting for MariaDB Cluster Galera Bootstrap master node to be accessable before starting replicant"
sleep 60
while ! mysqladmin ping -u replicant -preplicant00 -h mariadb_master_1 --silent; do
  sleep 1
done
exec /usr/bin/configure_slave.sh &
exit 0