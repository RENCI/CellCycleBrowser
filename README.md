# CellCycleBrowser

# Guide for setting up docker-based Django server local development environment for CellCycleBrowser project#

## Prerequisite ##
[Docker](https://www.docker.com/ "Docker") and [Docker Compose](https://docs.docker.com/compose/ "Docker Compose") need to be installed. On Windows, a Linux VM is needed.
## Steps to run Cell Cycle Browser Django web server in your local development environment ##
- git clone source code from this repo.
- Modify config/cc-config.yaml file to change ```CC_PATH``` to point to the root directory of the source tree for CellCycleBrowser.
- Copy local_settings.py from cellcycledev.renci.org and put it under the cellcycle directory. This local_settings.py holds sensitive information, so should not be exposed to the outside world.
- Create a directory ```data``` which holds csv dataset, and subdirectories ```config``` and ```model```. Refer to cellcycledev.renci.org and copy config, model input, and dataset to your local development environment.
- Modify docker-compose-dev.yml file to replace all occurrences of ```/home/ccbuild/CellCycleBrowser``` with the corresponding path in your local environment.
- ```cd cc_docker_base``` directory and run ```docker build -t cc_base .``` to build the base image. This only needs to be done once to build the environment unless you want to install more libraries/packages into your development environment.
- ```cd ..``` to get back to the root directory of the source tree, and run ```./ccctl deploy_dev_nodb``` to build all containers.
- Rebuild index_bundle.js using npm and drop it under ```cc_core/static/cc_core/js``` directory, then run ```docker exec -ti cellcycle python manage.py collectstatic``` to collect the updated index_bundle.js file into the static directory that can be served to the client by the Django server.
- At this point you should be able to open up your browser to get to the Cell Cycle Browser page: http://localhost:8000 from within the VM, or http://192.168.56.101:8000/ from the host if host-only adaptor is set up in VirtualBox for the Linux VM.


## Useful docker-compose commands to manage docker containers ##
- ```docker-compose up``` --- bring up all containers
- ```docker-compose stop``` --- shut down all containers
- ```docker-compose ps``` --- check status of all containers
- ```docker rm -fv $(docker ps -a -q``` --- remove all containers
- ```docker rmi -f <image_id>``` where ```<image_id>``` is the image id output from ```docker images``` command which you want to remove. 

## Troubleshooting notes ##
- You may need to run ```docker-compose stop``` followed by ```docker-compose up``` when you run into issues when bringing up containers the first time. 
- To run ```./ccctl``` command again, you need to clean up existing containers and images by running ```docker rm -fv $(docker ps -a -q``` to remove all containers and ```docker rmi -f <image_id>``` to remove images that need to be rebuilt.
   
