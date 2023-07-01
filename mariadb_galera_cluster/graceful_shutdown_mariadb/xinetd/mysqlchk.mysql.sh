#!/bin/bash
#
# This script checks if a mysql server is healthy running on localhost. It will
# return:
# "HTTP/1.x 200 OK\r" (if mysql is running smoothly)
# - OR -
# "HTTP/1.x 500 Internal Server Error\r" (else)
#
# The purpose of this script is make haproxy capable of monitoring mysql properly
#

SLAVE_LAG_LIMIT=5
MYSQL_HOST="localhost"
MYSQL_PORT="3306"
MYSQL_USERNAME='monitor'
MYSQL_PASSWORD='monitor00'
MYSQL_BIN='/usr/bin/mysql'
MYSQL_OPTS="-q -A --connect-timeout=10"
TMP_FILE="/dev/shm/mysqlchk.$$.out"
ERR_FILE="/dev/shm/mysqlchk.$$.err"
FORCE_FAIL="/dev/shm/proxyoff"

preflight_check()
{
    for I in "$TMP_FILE" "$ERR_FILE"; do
        if [ -f "$I" ]; then
            if [ ! -w $I ]; then
                echo -e "HTTP/1.1 503 Service Unavailable\r\n"
                echo -e "Content-Type: Content-Type: text/plain\r\n"
                echo -e "\r\n"
                echo -e "Cannot write to $I\r\n"
                echo -e "\r\n"
                exit 1
            fi
        fi
    done
}

return_ok()
{
    echo -e "HTTP/1.1 200 OK\r\n"
    echo -e "Content-Type: text/html\r\n"
    echo -e "Content-Length: 43\r\n"
    echo -e "\r\n"
    if [ $role == "master" ]; then
        echo -e "<html><body>MySQL master is running.</body></html>\r\n"
    elif [ $role == "slave" ]; then
        echo -e "<html><body>MySQL slave is running. (Slave lag: $SLAVE_LAG)</body></html>\r\n"
    else
        echo -e "<html><body>MySQL is running.</body></html>\r\n"
    fi
    echo -e "\r\n"
  #  rm $ERR_FILE $TMP_FILE
    exit 0
}
return_fail()
{
    echo -e "HTTP/1.1 503 Service Unavailable\r\n"
    echo -e "Content-Type: text/html\r\n"
    echo -e "Content-Length: 42\r\n"
    echo -e "\r\n"
    echo -e "<html><body>MySQL is *down*.</body></html>\r\n"
    echo -e "\r\n"
    exit 1
}

preflight_check

if [ -f "$FORCE_FAIL" ]; then
        echo "$FORCE_FAIL found" > $ERR_FILE
        return_fail
fi

CMDLINE="$MYSQL_BIN $MYSQL_OPTS --host=$MYSQL_HOST --port=$MYSQL_PORT --user=$MYSQL_USERNAME --password=$MYSQL_PASSWORD -e"
SLAVE_IO=$(${CMDLINE} 'SHOW SLAVE STATUS' --vertical 2>/dev/null | grep Slave_IO_Running |  tail -1 | awk {'print $2'})
SLAVE_SQL=$(${CMDLINE} 'SHOW SLAVE STATUS' --vertical 2>/dev/null | grep Slave_SQL_Running | head -1 | awk {'print $2'})

if [[ "${SLAVE_IO}" == "Yes" ]] && [[ "${SLAVE_SQL}" == "Yes" ]]; then
    role='slave'
    SLAVE_LAG=$(${CMDLINE} 'SHOW SLAVE STATUS' --vertical 2>/dev/null | grep Seconds_Behind_Master | tail -1 | awk {'print $2'})
    if [[ $SLAVE_LAG = 0 ]]; then
        return_ok
    elif [ $SLAVE_LAG -lt $SLAVE_LAG_LIMIT ] ; then
        return_ok
    fi
else
    role='master'
    READ_ONLY=$($CMDLINE 'SHOW GLOBAL VARIABLES LIKE "read_only"' --vertical 2>/dev/null | tail -1 | awk {'print $2'})
    [[ "${READ_ONLY}" == "OFF" ]] && return_ok
fi

return_fail