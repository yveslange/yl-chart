build:
	@echo "Build the project (BRUNCH)"
	@./node_modules/brunch/bin/brunch build
	@cp public/js/agchart.js release/agchart.js
	@cp public/css/agchart.css release/agchart.css
	@cp public/js/vendor.js release/vendor.js
build-prod:
	@echo "Build project for production (BRUNCH)"
	@cd public; rm -rf *;
	@./node_modules/brunch/bin/brunch build --production
	@mkdir -p release
	@cp public/js/agchart.js release/agchart.min.js
	@cp public/css/agchart.css release/agchart.min.css
	@cp public/js/vendor.js release/vendor.js
watch:
	@echo "Running the watcher (BRUNCH)"
	@./node_modules/brunch/bin/brunch watch
install:
	#@echo "Installing brunch & bower (NPM)"
	#@sudo npm install -g brunch
	#@sudo npm install -g bower
	@echo "Installing brunch dependencies (NPM)"
	@npm install
	@cd app; bower install
