#!/bin/bash
echo "Waiting for MariaDB Cluster Galera Bootstrap master node to be accessable before starting replicant"
sleep 60
while ! mysqladmin ping -u replicant -preplicant00 -h mariadb_slave_1 --silent; do
  sleep 1
done
echo "MariaDB Cluster Galera Bootstrap master node available" && su - mysql -c mariadbd