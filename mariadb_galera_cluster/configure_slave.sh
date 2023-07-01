#!/bin/bash
echo "Waiting for MariaDB node to be accessable before applying Master/Slave configuration"
while ! mysqladmin ping -u monitor -pmonitor00 --silent; do
  sleep 1
done
echo "Waiting for MariaDB Cluster Galera Bootstrap master node to be accessable before starting replicant"
while ! mysqladmin ping -u replicant -preplicant00 -h mariadb_master_1 --silent; do
  sleep 1
done
mysql -u replicant -preplicant00 -h mariadb_master_1 -e "FLUSH TABLES WITH READ LOCK;"
mysqldump -u replicant -preplicant00 -h mariadb_master_1 --all-databases --master-data --single-transaction --flush-logs --events > /tmp/master_dump.sql
log_file=`mysql -u replicant -preplicant00 -h mariadb_master_1 -e "SHOW MASTER STATUS\G" | grep File: | awk '{print $2}'`
pos=`mysql -u replicant -preplicant00 -h mariadb_master_1 -e "SHOW MASTER STATUS\G" | grep Position: | awk '{print $2}'`
mysql -u monitor -pmonitor00 -e "STOP SLAVE;";
mysql -u monitor -pmonitor00 < /tmp/master_dump.sql
mysql -u monitor -pmonitor00 -e "RESET SLAVE;";
mysql -u monitor -pmonitor00 -e "CHANGE MASTER TO MASTER_HOST='mariadb_master_1', MASTER_USER='replicant', MASTER_PASSWORD='replicant00', MASTER_LOG_FILE='${log_file}', MASTER_LOG_POS=${pos};"
mysql -u monitor -pmonitor00 -e "START SLAVE;"
mysql -u replicant -preplicant00 -h mariadb_master_1 -e "UNLOCK TABLES;"
echo "Master/Slave configuration finished!"