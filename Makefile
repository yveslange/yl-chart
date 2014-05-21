run:
	@coffee -c libs/agchart.coffee
watch:
	@coffee -o libs/ -wc src/agchart.coffee
install:
	@echo "Installing brunch & bower (NPM)"
	@sudo npm install -g brunch
	@sudo npm install -g bower
	@echo "Installing brunch dependencies (NPM)"
	@npm install
