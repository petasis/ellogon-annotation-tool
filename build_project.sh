#!/bin/bash
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
cd $DIR/ellogon_annotation_tool

git pull
npm run build
echo yes | python manage.py collectstatic
