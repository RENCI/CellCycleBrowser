FROM cc_base
MAINTAINER Hong Yi <hongyi@renci.org>

# install StochPy
RUN pip install scipy
RUN pip install python-libsbml
WORKDIR /usr/src
# RUN wget https://sourceforge.net/projects/stochpy/files/StochPy-2.3/StochPy-2.3.zip
RUN wget http://distribution.hydroshare.org/hongyi/StochPy-2.3.zip
RUN unzip StochPy-2.3.zip
WORKDIR /usr/src/StochPy-2.3
RUN python setup.py install

# install simplesbml
WORKDIR /usr/src
RUN wget https://github.com/sys-bio/simplesbml/archive/master.zip
RUN unzip master.zip
WORKDIR /usr/src/simplesbml-master
RUN python setup.py install

# Cleanup
RUN apt-get clean
RUN rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/* /usr/src/StochPy-2.3.zip /usr/src/StochPy-2.3 /usr/src/master.zip

RUN usermod -u HOST_USER_UID docker
RUN groupmod -g HOST_USER_GID docker

USER docker
WORKDIR /home/docker/cellcycle

CMD ["/bin/bash"]
