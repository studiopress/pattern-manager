#!/bin/bash

# This file lives in the root of a plugin directory to enable pluginade commands.

# Set this to the version of pluginade-scripts you want to use.
# For a list of available versions, see https://github.com/pluginade/pluginade-scripts/tags
pluginadeversion="0.0.2";

# Change the following variables to your plugin's namespace and textdomain:
textdomain="pattern-manager";
namespace="PatternManager";

# Dont make any more edits below this line.

# Check if an argument is provided
if [ -z "$1" ]; then
	# If no argument is provided, show help text.
	echo "Usage: sh pluginade.sh <The pluginade command you want to run>"
	echo "See all available commands at:"
	echo "https://github.com/pluginade/pluginade-scripts/blob/$pluginadeversion/available-commands.md"
	exit 1
fi

#  Set the plugin directory to be the current directory.
plugindir=$PWD;

#  Install pluginade-scripts if they are not already installed.
install_pluginade() {
	if [ ! -d ./pluginade ]; then
		echo "Installing pluginade into ${plugindir}/.pluginade";
		git clone https://github.com/pluginade/pluginade-scripts ./.pluginade
		cd .pluginade && git reset --hard && git checkout tags/$pluginadeversion && git pull origin tags/$pluginadeversion
	fi
}

if [ $1 = 'install' ]; then
	install_pluginade;
	exit 0;
fi

# Prior to running any command, ensure pluginade is ready.
install_pluginade;

# Go to the pluginade directory inside the plugin.
echo "Going to ${plugindir}/.pluginade";
cd $plugindir/.pluginade;

# Pass this command to pluginade-run.sh
sh pluginade-run.sh -p "${plugindir}" -c $1 -t $textdomain -n $namespace;
exit $?;