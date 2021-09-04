#!/bin/sh
target="build/index.html";
dest="/srv/http/build"

yarn run build\
&& sed -i 's/Web site created using create-react-app/Full Stack Pet Vaccination Management/' "$target"\
&& sed -i 's/React App/DoggoVac/' "$target"\
&& sudo rm -r "$dest"\
&& sudo cp -a build "$dest";
