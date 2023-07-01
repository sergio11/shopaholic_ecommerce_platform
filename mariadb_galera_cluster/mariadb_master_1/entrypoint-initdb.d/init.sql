CREATE USER 'monitor'@'%' IDENTIFIED BY 'monitor00';
GRANT ALL PRIVILEGES on *.* TO 'monitor'@'%';
CREATE USER 'replicant'@'%' IDENTIFIED BY 'replicant00';
GRANT ALL PRIVILEGES on *.* TO 'replicant'@'%';
CREATE USER 'dreamsoftware'@'%' IDENTIFIED BY 'dreamsoftware00';
GRANT ALL PRIVILEGES on *.* TO 'dreamsoftware'@'%';
FLUSH PRIVILEGES;