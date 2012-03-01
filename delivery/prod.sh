#!/bin/sh
if [ $# -eq 0 ]
then
    echo "need the git tag token"
    exit 1
else
    git tag $1
    scp -P 22 ../index.html david@bytedojo.com:/var/lib/vz/private/109/var/www/
    scp -P 22 ../contents/* david@bytedojo.com:/var/lib/vz/private/109/var/www/contents/
    scp -P 22 ../css/* david@bytedojo.com:/var/lib/vz/private/109/var/www/css/
    scp -P 22 ../js/* david@bytedojo.com:/var/lib/vz/private/109/var/www/js/
    scp -P 22 ../images/* david@bytedojo.com:/var/lib/vz/private/109/var/www/images/
fi
