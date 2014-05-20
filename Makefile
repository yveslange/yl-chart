run:
	@coffee -c libs/agchart.coffee
watch:
	@coffee -o libs/ -wc src/agchart.coffee
install:
	@echo "Installing coffee-toaster (NPM)"
	@sudo npm install -g coffee-toaster
