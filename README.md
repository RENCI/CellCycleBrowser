# CellCycleBrowser

# Guide for setting up docker-based Django server local development environment for CellCycleBrowser project#

## Prerequisite ##
[Docker](https://www.docker.com/ "Docker") and [Docker Compose](https://docs.docker.com/compose/ "Docker Compose") needs to be installed. On windows Operation System, a linux VM is needed. 
## Steps to have Cell Cycle Browser Django web server running in your local development environment ##
- git clone source code from this repo.
- modify config/cc-config.yaml file to change ```CC_PATH``` accordingly to point to the root directory of the source tree for CellCycleBrowser
- Copy local_settings.py from cellcycledev.renci.org and put it under cellcycle directory. This local_settings.py holds local secret, so cannot be exposed to outside world.
- create a directory ```data``` which holds cell csv data and subdirectories ```config``` and ```model```. Refer to cellcycledev.renci.org and copy config, model input, and cell data over to your local development environment. 
- modify docker-compose-dev.yml file to replace all occurrences of ```/home/ccbuild/CellCycleBrowser``` with the corresponding path in your local environment.
- ```cd cc_docker_base``` directory, and run the command ```docker build -t cc_base .``` to build the base image. This only needs to be done once to build the environment unless you want to install more libraries/packages into your development environment.
- ```cd ..``` to get back to the root directory of the source tree, and run command ```./ccctl deploy_dev_nodb``` to build all containers.
- rebuild index_bundle.js using npm and drop it under ```cc_core/static/cc_core/js``` directory, then run command ```docker exec -ti cellcycle python manage.py collectstatic``` to collect updated index_bundle.js file to static directory that can be served up to the client by Django server.
- At this point, you should be able to open up your browser to get to Cell Cycle Browser page: http://localhost:8000 from within VM or http://192.168.56.101:8000/ from the host if host-only adaptor is set up in VirtualBox for the linux VM. 
## Useful docker-compose commands to manage docker containers ##
- ```docker-compose up``` --- bring up all containers
- ```docker-compose stop``` --- shut down all containers
- ```docker-compose ps``` --- check status of all containers
   
