# Annotated Google Search

Explores Google's Custom Search PHP API by building an extendable boilerplate app around it featuring Angular, Bootstrap, Silex, and SQLite. 

## What It Is

It's a _proof of concept_ kind of app exploring ways to 

* organize and implement a PHP-backed Angular project
* do a custom Google search and post-process its results
* do the latter in a modular and boilerplate-like way as to be able to easily change or extend a behaviour

In other words, expect its feature set to be limited. That said, it will give you:

* an interface to run a Google search or restore a previous one
* the ability to work with a search result by collecting or trashing its items
* a tagging system as an example of some post-processing done on your collected items
* an auto-save mechanism to save the current state of a search   

To keep things simple, you will only have ten items per search to work with, which is the default setting of Google's Custom Search API. Likewise and although there are working server-side endpoints for this, you will not see a button for removing a previous search from the list of saved searches. For your own project, you might want to adjust both of this.

## Requirements

PHP > 5.5 with SQLite3

## Extended Requirements

To install and run the code, you'll need:

* Ruby (with [Rake](https://github.com/ruby/rake))
* Node (with [Bower](http://bower.io/) & [Grunt](http://gruntjs.com/))
* a Bash (Cygwin should work fine)

To install Rake, do:

`$ gem install rake`

To install Bower & Grunt, do:

`$ npm install -g bower grunt-cli`

## Installation

After cloning the repo and changing into the project directory, do:

`$ rake install:install`

This will install all required dependencies, thus it might take a while. Once it has finished, you can already run all client-side tests with:

`$ rake test:karma`

To fully configure the app, you need to obtain two Google keys first. See _Configuration_(#configuration) on how to do so. 

After the app is configured, you can run all server-side tests by calling: 

`$ rake test:server`

When done, visit `/path/to/app` with your browser and give it a try. 

## <a id="configuration"></a>Configuration

You'll need two keys to be able to issue queries against Google's Custom Search API:

1. A Google Developers Console API key 
2. A Google Custom Search Engine key

Rename `storage/config.sample.yml` to `storage/config.yml`, then follow the step by step instructions below on how to acquire those keys, and adjust the configuration file accordingly. Visit `/path/to/app` with your browser when done.

#### Acquire a Google Developers API Key

1. Register a project with [Google's Developer Console](https://console.developers.google.com).
2. Activate Google's Custom Search API.
3. Create a public API _server_ key (when testing locally: without restricting access to certain IPs).
4. Copy & paste the key into `storage/config.yml` (as `Google_API_Key`).

#### Acquire a Google Custom Search Engine Key

1. Sign in to https://www.google.com/cse and create a Custom Search Engine (CSE).
2. Configure the CSE to search the entire web.
3. Copy & paste the CSE id into `storage/config.yml` (as `Google_CSE_Key`).

For help, follow: 

* [How to register a project with Googles Developer Console & how to obtain an API key](https://developers.google.com/console/help/new/)
* [How to activate Google's Custom Search API & how to create a Custom Search Engine (CSE) to obtain a CSE key](https://developers.google.com/console/help/new/)
* [How to search the entire web with a custom search](https://support.google.com/customsearch/answer/2631040)

#### Alternative Approach

If you just want to have a look at the app, you can feed it with sample data, which doesn't require any keys or configuration. This has some drawbacks, though:

* You need sqlite3 available on the shell to make the sample data import work
* Obviously, you won't be able to do a real Google search 

Anyway, to load the sample data, do:

`$ rake db:import_sample`

Visit `/path/to/app` with your browser when done. You should see a list of saved searches to work with. 

Expect the server-side tests still to fail, though, unless you update the test query in `src/sys/test/SearchTest.php` to some existing sample data query value ("Henry David Thoreau" should always be a good guess). 

## When on Windows

On Windows, you may need to activate the [SQLite3 dll](http://php.net/manual/en/sqlite3.installation.php).

## Running Midway Tests

While front-end unit tests should run out of the box (with `$ rake test:karma` and `$ rake test:karma_autowatch`), you might want to adjust the url settings for both _base_ and _test_ in `karma.proxies.conf.js` to run [midway tests](http://stackoverflow.com/a/24151002/3323348) as well. To actually run them, do 

`$ rake test:midway`

or

`$ rake test:midway_autowatch`

respectively.

## Manifest

This is _proof of concept_-code. Expect it to be un-DRY at times, and to miss some checks and balances. 

## License

GNU GPL v2 or later