## Dynamic Signal
# v 1.01

This is a Wordpress theme developed for dynamicsignal.com. It does not leverage any interior features of Wordpress, and as such does not instantiate wp_head or wp_footer.

To install, this folder should be set in the root of the backup folder from flywheel (http://getflywheel.com).

After installing, pull up a bash terminal and run

  npm install

(if npm is not yet installed please seek instructions at https://www.npmjs.com/)

Thn run

  gulp

(if gulp is not installed please find instructions at https://gulpjs.com/)

This should build the theme folder (labelled "ds-new") into the wordpress theme folder.

This app uses PUG (https://pugjs.org/) as its templating language, and scrollmagic (http://scrollmagic.io/) for parallax effects.

Questions? You can find me at alexbeuscher@gmail.com
