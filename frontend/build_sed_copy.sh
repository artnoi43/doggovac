#!/bin/sh
target="build/index.html";
dest="/srv/http/doggovac_frontend"

yarn run build\
&& sed -i 's/Web site created using create-react-app/Full Stack Pet Vaccination Management/' "$target"\
&& sed -i 's/React App/DoggoVac/' "$target"\
&& sudo rsync -avP --delete build/* "$dest";
