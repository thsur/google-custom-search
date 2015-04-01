require 'rake'

# Installation & setup:
#
# $: rake init_dirs
# $: rake get_composer
# $: rake get_laravel
# $: rake init_angular

task :default do
  sh 'rake --tasks'
end

# Setup

namespace :install do

  desc 'Install app.'
  task :install do

    sh 'chmod 775 src/storage'
    sh 'chmod 744 src/public/app/connect.php';
    sh 'mv src/storage/config.sample.yml src/storage/config.yml'

    Rake::Task['install:composer'].invoke
    Rake::Task['install:phpunit'].invoke
    Rake::Task['update:composer'].invoke
    Rake::Task['update:npm'].invoke
    Rake::Task['update:bower'].invoke

    sh 'php src/sys/main.php' # Init db
  end

  desc 'Install Composer.'
  task :composer do
    sh 'curl -sS https://getcomposer.org/installer | php'
  end

  desc 'Install PHPUnit.'
  task :phpunit do
    sh 'wget https://phar.phpunit.de/phpunit.phar'
    sh 'chmod +x phpunit.phar'
  end
end

# Maintenance

namespace :update do

  desc 'Update Composer packages.'
  task :composer do
    sh 'composer.phar update --verbose'
  end

  desc 'Update npm packages.'
  task :npm do
    cd('src/public') do
      sh 'npm update'
    end
  end

  desc 'Update Bower packages.'
  task :bower do
    cd('src/public') do
      sh 'bower update --verbose'
    end
  end

  desc 'Update Ruby gems.'
  task :gems do
    sh 'bundle update --verbose'
  end

  desc 'Update PHP autoload.'
  task :autoload do
    sh 'composer.phar dump-autoload'
  end

  desc 'Backup everything inside and below the current folder into backup.tar.gz.'
  task :backup do

    file = 'backup.tar.gz'
    excl = '--exclude=src/sys/vendor --exclude=src/public/node_modules --exclude=src/public/app/bower_components'
    tar  = "tar -caf #{file} #{excl} ./{*,.??*}"

    rm file, { verbose: true } if File.exists? file
    sh tar
  end
end

namespace :db do

  desc 'Dump db data (saved queries only).'
  task :dump do
    cd('src/storage') do
      sh 'sqlite3 queries.db ".dump queries" | grep -v "^CREATE" > db.dump.sql'
    end
  end

  desc 'Load sample db data.'
  task :import_sample do
    cd('src/storage') do
      sh 'cat db.dump.sql | sqlite3 queries.db'
    end
  end
end

# Testing

namespace :test do

  desc 'Run Silex tests with PHPUnit.'
  task :server do
    begin
      sh './phpunit.phar --no-globals-backup src/sys/test/'
    rescue => e
      puts 'Task failed.'
    end
  end

  desc 'Run Jasmine unit tests.'
  task :karma do
    cd('src/public') do
      sh './karma.sh'
    end
  end

  desc 'Run unit tests & watch for changes.'
  task :karma_autowatch do
    cd('src/public') do
      sh './karmawatch.sh'
    end
  end

  desc 'Run Mocha midway tests.'
  task :midway do
    cd('src/public') do
      sh './karma-midway.sh --single-run'
    end
  end

  desc 'Run midway tests & watch for changes.'
  task :midway_autowatch do
    cd('src/public') do
      sh './karma-midway.sh'
    end
  end

  desc 'Run all PHP & JS tests.'
  task :all do
    Rake::Task['test:server'].invoke
    Rake::Task['test:karma'].invoke
    Rake::Task['test:midway'].invoke
  end
end

# Git

namespace :git do

  desc 'Stage changes to git. Auto-remove deleted files.'
  task :stage do

    # http://tylerfrankenstein.com/code/how-git-rm-all-deleted-files-shown-git-status
    # http://www.cyberciti.biz/faq/bash-scripting-using-awk/

    del = `git status --porcelain | awk '/^(\sD|DD)/ {print $2}'`

    sh "git rm #{del}" if File.exists? del
    sh 'git add .'
    sh 'git status'
  end

  desc 'Print decorated log of the last four commits made.'
  task :log do

    sh "git log -n 4 --decorate --pretty=short --abbrev-commit --notes"
  end

  desc 'List affected files for a commit given as "rake git:files sha=[...]".'
  task :files do

    # For one technique of passing command line arguments see:
    # http://stackoverflow.com/a/5050412
    sha = ENV['sha']

    # http://stackoverflow.com/a/424142
    sh "git show --pretty='format:' --name-status #{sha}"
  end

  desc 'Diff working tree against the current head or a commit given as "rake git:diff sha=[...]".'
  task :diff do

    sha = ENV['sha']
    sh "git diff --stat #{sha}"
  end

  desc 'List untracked files.'
  task :untracked do
    sh "git ls-files --others --exclude-standard"
  end

  desc 'List ignored files.'
  task :ignored do
    sh "git ls-files --others --ignored --exclude-standard"
  end
end

