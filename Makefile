push:
	rsync -avz --delete -e ssh . clwen@ml.media:~/public_html/vblocks
local:
	rsync -avz --delete . /usr/local/var/www/vblocks.com
test:
	rsync -avz --delete -e ssh . clwen@ml.media:~/public_html/vblocks_test
