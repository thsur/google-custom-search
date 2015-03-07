# Annotated Google Search

## What it does

...

## Requirements

PHP > 5.5 with SQLite3

## Making it work

In case you want more than just browse the code.

### Extended Requirements

To work with the source code, you may want to have:
Ruby, Rake, Node, Yeoman, Bower & a Bash (Cygwin should work fine).  

### Obtain keys

You'll need two keys to be able to query Google's Custom Search API:

1. A Google Developers Console API key 
2. A Google Custom Search Engine key

* https://console.developers.google.com

For further instructions, see: 

* [How to register a project with Googles Developer Console & how to obtain an API key](https://developers.google.com/console/help/new/)
* [How to activate Google's Custom Search API & how to create a Custom Search Engine (CSE) to obtain a CSE key](https://developers.google.com/console/help/new/)
* [How to search the entire web with a custom search](https://support.google.com/customsearch/answer/2631040)

So, the steps are:

1. Register a project with Google's Developer Console.
2. Activate Google's Custom Search API.
3. Create a public API _server_ key (when testing locally: without restricting access to certain IPs).
4. Copy & paste the key into storage/config.sample.yml (as `Google_API_Key`).
5. Sign in to https://www.google.com/cse and create a Custom Search Engine (CSE).
6. Configure the CSE to search the entire web.
7. Copy & paste the CSE id into storage/config.sample.yml (as `Google_CSE_Key`).
8. Rename storage/config.sample.yml to storage/config.yml
9. Hit your browser with /path/to/app    

### When on Windows

On Windows, you may need to activate the SQLite3 dll, see http://php.net/manual/en/sqlite3.installation.php.

### Install the app

...

### Running tests

If you want to run any midway tests, you might want to change the urls for both `base` and `test` in `karma.proxies.conf.js`. 

Unit tests should run without the need for changes.

## License

GNU GPL v2