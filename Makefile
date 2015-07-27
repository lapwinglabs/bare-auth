development:
	@./node_modules/.bin/node-dev index.js

production:
	@NODE_ENV=production node index.js

.PHONY: development
