#!/bin/sh

cd /home/docker/cellcycle
celery worker -A cellcycle -E -Q default
