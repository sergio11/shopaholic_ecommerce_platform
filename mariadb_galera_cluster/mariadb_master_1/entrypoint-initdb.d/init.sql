CREATE USER 'monitor'@'%' IDENTIFIED BY 'monitor';
GRANT ALL PRIVILEGES on *.* TO 'monitor'@'%';
CREATE USER 'replicant'@'%' IDENTIFIED BY 'replicant00';
GRANT ALL PRIVILEGES on *.* TO 'replicant'@'%';
CREATE USER 'iptv'@'%' IDENTIFIED BY 'iptv00';
GRANT ALL PRIVILEGES on *.* TO 'iptv'@'%';
FLUSH PRIVILEGES;