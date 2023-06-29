CREATE USER 'monitor'@'%' IDENTIFIED BY 'monitor00';
CREATE USER 'dreamsoftware'@'%' IDENTIFIED BY 'dreamsoftware00';
GRANT ALL PRIVILEGES on *.* TO 'dreamsoftware'@'%';
FLUSH PRIVILEGES;