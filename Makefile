REPORTER=spec

test:
	./node_modules/.bin/istanbul cover ./node_modules/.bin/_mocha -- -R $(REPORTER)

test-coveralls:
	./node_modules/.bin/istanbul cover ./node_modules/.bin/_mocha \
	--report lcovonly -- -R $(REPORTER) && \cat ./coverage/lcov.info | \
	./node_modules/.bin/coveralls && rm -rf ./coverage

.PHONY: test