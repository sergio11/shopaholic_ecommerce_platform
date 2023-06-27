FROM mariadb:10.10

COPY signal-listener.sh /run.sh
# Entrypoint overload to catch the ctrl+c and stop signals
ENTRYPOINT ["/bin/bash", "/run.sh"]
CMD ["mariadbd"]