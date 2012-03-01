#!/bin/sh
if [ $# -eq 0 ]
then
    echo "need the git tag token"
    exit 1
else
    git tag $1
    scp -P 22 index.html david@bytedojo.com:/var/lib/vz/private/109/var/www/
    scp -P 22 -r contents david@bytedojo.com:/var/lib/vz/private/109/var/www/
    scp -P 22 -r css david@bytedojo.com:/var/lib/vz/private/109/var/www/
    scp -P 22 -r js david@bytedojo.com:/var/lib/vz/private/109/var/www/
    scp -P 22 -r images david@bytedojo.com:/var/lib/vz/private/109/var/www/
fi
