#!/bin/sh

mc admin user add myminio shopaholic shopaholic00
mc admin group add myminio admin shopaholic
mc admin policy set myminio readwrite user=shopaholic
