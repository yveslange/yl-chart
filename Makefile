build:
	@echo "Build the project (BRUNCH)"
	@./node_modules/brunch/bin/brunch build
	@cp public/js/vendor.js release/vendor.js
	@cp public/js/ylchart.js release/ylchart.js
	@cp public/css/ylchart.css release/ylchart.css
build-prod: build
	@echo "Build project for production (BRUNCH)"
	#@cd public; rm -rf *;
	@./node_modules/brunch/bin/brunch build --production
	@mkdir -p release
	@cp public/js/vendor.js release/vendor.js
	@cp public/js/ylchart.js release/ylchart.min.js
	@cp public/css/ylchart.css release/ylchart.min.css
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
clean:
	@cd release/;rm -rf *;cd ..
	@cd public/;rm -rf *; cd ..
