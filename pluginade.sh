#!/bin/bash

# This file lives in the root of a plugin directory to enable pluginade commands.

# Change the following variables to your plugin's namespace and textdomain:
textdomain="pattern-manager";
namespace="PatternManager";

# Dont make any more edits below this line.

# Check if an argument is provided
if [ -z "$1" ]; then
	# If no argument is provided, show the help text.
	echo "Usage: sh pluginade.sh <The pluginade command you want to run>"
	echo "Available commands:"
	echo "install       Install Pluginade Scripts into a hidden .pluginade directory, in the plugin root."
	echo "lint:php      Run PHP Linting."
	echo "lint:php:fix  Run PHP Lint Fixing."
	echo "lint:css      Run CSS Linting."
	echo "lint:css:fix  Run CSS Lint Fixing."
	echo "lint:js       Run JS Linting."
	echo "lint:js:fix   Run JS Lint Fixing."
	echo "test:js       Run JS Jest Testing."
	echo "test:phpunit  Run PHP Unit Testing."
	echo "zip           Build an installable zip."
	echo "dev           Run dev mode (npm run dev) for all wp-modules."
	echo "build         Run build (npm run build) for all wp-modules."
	exit 1
fi

#  Set the plugin directory to be the current directory.
plugindir=$(PWD);

#  Install pluginade-scripts if they are not already installed.
install_pluginade() {
	if [ ! -d ./pluginade ]; then
		echo $PWD;
		ls -a .
		git clone https://github.com/pluginade/pluginade-scripts ./.pluginade
		cd .pluginade && git reset --hard && git checkout main && git pull origin main
	fi
}

if [ $1 = 'install' ]; then
	install_pluginade;
	exit 0;
fi

# Prior to running any command, ensure pluginade is ready.
install_pluginade;

# Go to the pluginade directory inside the plugin.
cd "${plugindir}"/.pluginade;

#  Start dev mode (npm run dev) for all wp-modules.
if [ $1 = 'dev' ]; then
	# Run PHP Code Sniffer with WordPress Coding Standards.
	sh pluginade-run.sh -p "${plugindir}" -c "dev" -t $textdomain -n $namespace;
fi

#  Run build (npm run build) for all wp-modules.
if [ $1 = 'build' ]; then
	# Run PHP Code Sniffer with WordPress Coding Standards.
	sh pluginade-run.sh -p "${plugindir}" -c "build" -t $textdomain -n $namespace;
fi

#  PHP Linting. To run this, type: sh pluginade.sh lint:php
if [ $1 = 'lint:php' ]; then
	# Run PHP Code Sniffer with WordPress Coding Standards.
	sh pluginade-run.sh -p "${plugindir}" -c "lint:php" -t $textdomain -n $namespace;
	exit $?;
fi

# PHP Lint Fixing. To run this, type: sh pluginade.sh lint:php:fix
if [ $1 = 'lint:php:fix' ]; then
	sh pluginade-run.sh -p "${plugindir}" -c "lint:php:fix" -t $textdomain -n $namespace;
	exit $?;
fi

#  CSS Linting. To run this, type: sh pluginade.sh lint:css
if [ $1 = 'lint:css' ]; then
	# Run CSS linting.
	sh pluginade-run.sh -p "${plugindir}" -c "lint:css" -t $textdomain -n $namespace;
	exit $?;
fi

# CSS Lint Fixing. To run this, type: sh pluginade.sh lint:css:fix
if [ $1 = 'lint:css:fix' ]; then
	# Run CSS linting.
	sh pluginade-run.sh -p "${plugindir}" -c "lint:css:fix" -t $textdomain -n $namespace;
	exit $?;
fi

#  JS Linting. To run this, type: sh pluginade.sh lint:js
if [ $1 = 'lint:js' ]; then
	sh pluginade-run.sh -p "${plugindir}" -c "lint:js" -t $textdomain -n $namespace;
	exit $?;
fi

# JS Lint Fixing. To run this, type: sh pluginade.sh lint:js:fix
if [ $1 = 'lint:js:fix' ]; then
	sh pluginade-run.sh -p "${plugindir}" -c "lint:js:fix" -t $textdomain -n $namespace;
	exit $?;
fi

# JS Jest Testing. To run this, type: sh pluginade.sh test:js
if [ $1 = 'test:js' ]; then
	sh pluginade-run.sh -p "${plugindir}" -c "test:js" -t $textdomain -n $namespace;
	exit $?;
fi

# PHP Unit Testing. To run this, type: sh pluginade.sh test:phpunit
if [ $1 = 'test:phpunit' ]; then
	sh pluginade-run.sh -p "${plugindir}" -c "test:phpunit" -t $textdomain -n $namespace;
	exit $?;
fi

# Build an installable zip. To run this, type: sh pluginade.sh zip
if [ $1 = 'zip' ]; then
	sh pluginade-run.sh -p "${plugindir}" -c "zip" -t $textdomain -n $namespace;
	exit $?;
fi