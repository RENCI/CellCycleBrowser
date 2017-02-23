This is the working directory of StochPy which needs to be created beforehand and volume 
mount into the cellcycle and worker containers for model execution. Otherwise, 
permission errors would result when creating this working directory under /home/docker
by StochPy since only root can create directories under /home/docker and we are running 
containers and servers as regular docker user who does not have permission to create 
a directory under /home/docker.
