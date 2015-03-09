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

  desc 'Setup directory structure.'
  task :init_dirs do
    sh 'mkdir --parents bin dist src/storage src/sys/test src/public'
    sh 'chmod 775 src/storage'
  end

  desc 'Install Composer.'
  task :composer do
    sh 'curl -sS https://getcomposer.org/installer | php'
  end

  desc 'Install Silex.'
  task :silex do

    # We need Angular's dir structure, so make sure it's created.

    if Dir.exists?('src/public/app')
      Rake::Task['install:angular'].invoke
    end

    Rake::Task['update:composer'].invoke

    # Create an empty Silex bootstrap/app file.

    sh 'touch src/public/app/connect.php';
    sh 'chmod 744 src/public/app/connect.php';
  end

  desc 'Install Angular.'
  task :angular do
    cd('src/public') do
      sh 'yo angular'
    end
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

  desc 'Update Bower packages.'
  task :bower do
    sh 'bower update --verbose'
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

  desc 'Run Jasmine unit tests with Karma.'
  task :karma do
    cd('src/public') do
      sh './karma.sh'
    end
  end

  desc 'Run Jasmine tests & watch for changes.'
  task :karma_autowatch do
    cd('src/public') do
      sh './karmawatch.sh'
    end
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

  desc 'List current or stats for a commit given as "rake git:stats sha=[...]".'
  task :stats do

    sha = ENV['sha']
    sh "git diff --stat #{sha}"
  end
end

