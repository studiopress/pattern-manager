# Do not touch this file.

# If it doesn't already exist, clone wp-plugin-sidekick to the plugins directory.
cd ../;
FILE=wp-plugin-sidekick/
if [ ! -d "$FILE" ]; then
	git clone https://github.com/johnstonphilip/wp-plugin-sidekick;
fi

cd -;

# Loop through each wp-module in the plugin.
for DIR in wp-modules/*/; do
	# Go to the directory of this custom-module.
	cd "$DIR";

	# Run the "npm run dev" command in it's package.json file.
	echo $DIR;
	npm install;

	# Go back to main directory, which includes the wp modules.
	cd -;
	
done
