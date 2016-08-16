FROM python:2.7.11
MAINTAINER Hong Yi <hongyi@renci.org>
# Adapted from https://github.com/hydroshare/hs_docker_base/blob/develop/Dockerfile

RUN apt-get update && apt-get install -y apt-transport-https
COPY docker.list /etc/apt/sources.list.d/

RUN apt-get update && apt-get install -y --force-yes \
    docker-engine \
    sudo \
    libjpeg62-turbo \
    libjpeg62-turbo-dev \
    binutils \
    build-essential \
    postgresql-9.4 \
    postgresql-client-9.4 \
    git \
    zip \
    rsync \
    openssh-client \
    openssh-server

# Install SSH for remote PyCharm debugging
RUN mkdir /var/run/sshd
RUN echo 'root:docker' | chpasswd
RUN sed -i 's/PermitRootLogin without-password/PermitRootLogin yes/' /etc/ssh/sshd_config

# SSH login fix. Otherwise user is kicked off after login
RUN sed 's@session\s*required\s*pam_loginuid.so@session optional pam_loginuid.so@g' -i /etc/pam.d/sshd

ENV NOTVISIBLE "in users profile"
RUN echo "export VISIBLE=now" >> /etc/profile

# Add docker user for use with SSH debugging
RUN useradd -d /home/docker -g docker docker \
    && echo 'docker:docker' | chpasswd

WORKDIR /usr/src/

# Install pip based packages (due to dependencies some packages need to come first)
RUN pip install --upgrade pip
RUN pip install Django==1.10
RUN pip install numpy==1.11.1
RUN pip install \
    arrow==0.7.0 \
    beautifulsoup4==4.4.1 \
    celery==3.1.23 \
    coverage==4.0.3 \
    django-autocomplete-light==2.0.9 \
    django-compressor==2.0 \
    django-contrib-comments==1.6.2 \
    django-crispy-forms==1.6.0 \
    django-debug-toolbar==1.4 \
    django-jsonfield==0.9.19 \
    django-timedeltafield==0.7.10 \
    django-widget-tweaks==1.4.1 \
    djangorestframework==3.3.3 \
    docker-py==1.7.2 \
    filebrowser-safe==0.4.3 \
    future==0.15.2 \
    gunicorn==19.4.5 \
    matplotlib==1.5.1 \
    pandas==0.18.0 \
    pep8==1.7.0 \
    Pillow==3.1.1 \
    psycopg2==2.6.1 \
    pysqlite==2.8.1 \
    requests==2.9.1 \
    sh==1.11

# install StockPy
RUN pip install scipy
RUN pip install python-libsbml
WORKDIR /usr/src
RUN wget https://sourceforge.net/projects/stochpy/files/StochPy-2.3/StochPy-2.3.zip
RUN unzip StochPy-2.3.zip
WORKDIR /usr/src/StochPy-2.3
RUN python setup.py install

# Cleanup
RUN apt-get clean
RUN rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/* /usr/src/StochPy-2.3.zip /usr/src/StochPy-2.3
