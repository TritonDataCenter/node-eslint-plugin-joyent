
all:
	npm install

check:
	./node_modules/.bin/eslint .

fmt:
	./node_modules/.bin/eslint --fix .
