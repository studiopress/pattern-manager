wp-scripts start includes/js/src/index.js --output-path=includes/js/build/ &
npx postcss includes/css/src/tailwind.css -o includes/css/build/tailwind-style.css --env development -w
