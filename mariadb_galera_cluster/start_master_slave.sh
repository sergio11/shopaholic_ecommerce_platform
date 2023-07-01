#!/bin/bash
echo "Waiting for MariaDB Cluster Galera Bootstrap master node to be accessable before starting replicant"
sleep 60
while ! mysqladmin ping -u replicant -preplicant00 -h mariadb_master_1 --silent; do
  sleep 1
done
exec ./configure_slave.sh &
echo "MariaDB Cluster Galera Bootstrap master node available" && mysql_install_db --user=mysql --ldata=/var/lib/mysql/ && su - mysql -c mariadbd