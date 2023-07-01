#!/bin/bash

# for ANY state transition.
# "notify" script is called AFTER the
# notify_* script(s) and is executed
# with 3 arguments provided by keepalived
# (ie don't include parameters in the notify line).
# arguments
# $1 = "GROUP"|"INSTANCE"
# $2 = name of group or instance
# $3 = target state of transition
#     ("MASTER"|"BACKUP"|"FAULT")

TYPE=$1
NAME=$2
STATE=$3

case $STATE in
    "MASTER") echo "[$1 - $2] I'm the MASTER! Whup whup." > /proc/1/fd/1
        exit 0
    ;;
    "BACKUP") echo "[$1 - $2] Ok, i'm just a backup, great." > /proc/1/fd/1
        exit 0
    ;;
    "FAULT")  echo "[$1 - $2] Fault, what ?" > /proc/1/fd/1
        exit 0
    ;;
    *)        echo "[$1 - $2] Unknown state" > /proc/1/fd/1
        exit 1
    ;;
esac