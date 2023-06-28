#!/bin/bash
echo "Waiting for MariaDB Cluster Galera Bootstrap master node to be accessable before starting replicant"
while ! mysqladmin ping -u replicant -preplicant00 -h mariadb_master_1 --silent; do
  sleep 1
done
mysql -u replicant -preplicant00 -h mariadb_master_1 -e "FLUSH TABLES WITH READ LOCK;"
mysqldump -u replicant -preplicant00 -h mariadb_master_1 --all-databases --master-data --single-transaction --flush-logs --events > /tmp/master_dump.sql
log_file=`mysql -u replicant -preplicant00 -h mariadb_master_1 -e "SHOW MASTER STATUS\G" | grep File: | awk '{print $2}'`
pos=`mysql -u replicant -preplicant00 -h mariadb_master_1 -e "SHOW MASTER STATUS\G" | grep Position: | awk '{print $2}'`
while ! mysqladmin ping -u dreamsoftware -pdreamsoftware00 -h mariadb_slave_1 --silent; do
  sleep 1
done
mysql -u dreamsoftware -pdreamsoftware00 -h mariadb_slave_1 -e "STOP SLAVE;";
mysql -u dreamsoftware -pdreamsoftware00 -h mariadb_slave_1 < /tmp/master_dump.sql
mysql -u dreamsoftware -pdreamsoftware00 -h mariadb_slave_1 -e "RESET SLAVE;";
mysql -u dreamsoftware -pdreamsoftware00 -h mariadb_slave_1 -e "CHANGE MASTER TO MASTER_HOST='mariadb_master_1', MASTER_USER='replicant', MASTER_PASSWORD='replicant00', MASTER_LOG_FILE='${log_file}', MASTER_LOG_POS=${pos};"
mysql -u dreamsoftware -pdreamsoftware00 -hmariadb_slave_1 -e "START SLAVE;"
mysql -u replicant -preplicant00 -h mariadb_master_1 -e "UNLOCK TABLES;"
echo "Master/Slave configuration finished" && sh /start_replicant_cluster_2.sh