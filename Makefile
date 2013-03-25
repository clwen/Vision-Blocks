vb:
	rsync -avz --delete -e ssh . clwen@vb.media:~/public_html/vblocks
beta:
	rsync -avz --delete -e ssh . clwen@vb.media:~/public_html/beta
web:
	rsync -avz --delete -e ssh . clwen@ml.media:~/public_html/vblocks
local:
	rsync -avz --delete . /usr/local/var/www/vblocks.com
