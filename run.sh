#!/bin/bash

docker run \
    --rm \
	-it \
	-p 3000:3000 \
	-p 5000:5000 \
	-p 27017:27017 \
    -v /home/akrishnan/gitclones/docker-wunderkiste/birthday-crowdfunder/:/home/akrishnan/gitclones/docker-wunderkiste/birthday-crowdfunder \
    -w /home/akrishnan/gitclones/docker-wunderkiste/birthday-crowdfunder \
	--name crowdfunder \
	meanjs/mean /bin/bash

#	--entrypoint="jupyter notebook --notebook-dir /home/jovyan/gitclones" \
