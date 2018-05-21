#!/usr/bin/env bash

Green='\033[0;32m'
Red='\033[0;31m'
CloseColor='\033[0m'

rm -rf node_modules
rm conf.js

npm install

if [ "$1" == "test" ]; then
    sed -ie "s/version = '1.0'/version = '1.0t'/" node_modules/core/constants.js
fi

cp "environments/$1.conf.js" conf.js

echo -e "${Green}* Done! ${CloseColor}"