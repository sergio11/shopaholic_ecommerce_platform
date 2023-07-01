#!/bin/bash

safeToBootStrap() {
    echo "Container stopped, performing safe to bootstrap"
    FILE=/var/lib/mysql/grastate.dat
    if test -f "$FILE";
    then
      sed -i 's/safe_to_bootstrap: 0/safe_to_bootstrap: 1/' "$FILE"
    fi
    exit
}

startListener() {
    "$@" &
    #Trap SIGTERM
    trap 'safeToBootStrap' INT TERM
    exec /usr/bin/run_xinetd.sh &
    while :; do
        sleep 1s
    done
}


startListener docker-entrypoint.sh "$@"