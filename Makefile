push:
	# scp -r . ml.media:~/public_html/vblocks
	rsync -avz --delete -e ssh . clwen@ml.media:~/public_html/vblocks
test:
	# scp -r . ml.media:~/public_html/vblocks_test
	rsync -avz --delete -e ssh . clwen@ml.media:~/public_html/vblocks_test
