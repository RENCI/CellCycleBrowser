#!/bin/bash
# Collect static files to be served

echo "yes" | docker exec -i cellcycle python manage.py collectstatic
