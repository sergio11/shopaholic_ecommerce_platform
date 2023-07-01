#!/bin/bash
echo "Waiting for MariaDB Cluster Galera Bootstrap master node to be accessable before starting replicant"
sleep 60
while ! mysqladmin ping -u monitor -pmonitor00 -h mariadb_slave_1 --silent; do
  sleep 1
done
echo "Starting slave"
exit 0