FROM renci/ccb_docker_base:1.0
MAINTAINER Hong Yi <hongyi@renci.org>

# install StochPy
RUN pip install scipy==1.0.0
RUN pip install python-libsbml==5.15.0
RUN pip install simplesbml==1.2.2
WORKDIR /usr/src
# RUN wget https://sourceforge.net/projects/stochpy/files/StochPy-2.3/StochPy-2.3.zip
RUN  wget --no-check-certificate https://people.renci.org/~hongyi/StochPy-2.3.zip
RUN unzip StochPy-2.3.zip
WORKDIR /usr/src/StochPy-2.3
RUN python setup.py install

# install simplesbml
#WORKDIR /usr/src
#RUN wget https://github.com/sys-bio/simplesbml/archive/master.zip
#RUN unzip master.zip
#WORKDIR /usr/src/simplesbml-master
#RUN python setup.py install

# Cleanup
RUN apt-get clean
#RUN rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/* /usr/src/StochPy-2.3.zip /usr/src/StochPy-2.3 /usr/src/master.zip
RUN rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/* /usr/src/StochPy-2.3.zip /usr/src/StochPy-2.3 

RUN usermod -u 1000 docker
RUN groupmod -g 1000 docker

USER docker
WORKDIR /home/docker/cellcycle

CMD ["/bin/bash"]
