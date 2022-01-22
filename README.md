# sneakygamesjsbot
SneakyGames discord bot made with love and javascript

## Modules:
Please, when making updates, remember to list any npm modules that you add. This way it will be easier for sneaky and everyone. Thanks.

 - Discord.js (v13)
 - fs (newest)


## Update log:
1. Updated and fixed command handler
   - Fixed mayor bugs.
   - Command files will now be stored in category folders for organization purposes.
   - The 'category' atribute has been added to the command handler, it can now be used in commands like a command / category list.
 
2. Added the 'functions' file in src/utils
     - This file will contain useful functions that can be used in multiple files.
   - formatNumber function added
     - This function will format any number as a quantity. Examples: 1.000 -> 1k │ 1.000.000 -> 1M │ etc.
   - checkPerms function added
     - This function will check if a user has a specific permission.

3. Added 'help' command, styled the files and added comments for new contributors.

4. Added 'purge' command, added welcome channel with invite count.
