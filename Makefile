build:
	@echo "Build the project (BRUNCH)"
	@brunch build
build-prod:
	@echo "Build project for production (BRUNCH)"
	@cd public; rm -rf *;
	@brunch build --production
watch:
	@echo "Running the watcher (BRUNCH)"
	@brunch watch
install:
	@echo "Installing brunch & bower (NPM)"
	@sudo npm install -g brunch
	@sudo npm install -g bower
	@echo "Installing brunch dependencies (NPM)"
	@npm install
