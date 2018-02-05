#!/bin/sh

cd /home/docker/cellcycle
celery beat -A cellcycle -s /home/docker/cellcycle/celery/celerybeat-schedule &
celery worker -A cellcycle -E -Q default
