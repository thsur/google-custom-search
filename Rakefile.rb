require 'rake'

# Installation & setup:
#
# $: rake get_composer
# $: rake setup_laravel

task :default do
    sh 'rake --tasks'
end

# Setup

desc 'Install composer.'
task :get_composer do
  sh 'curl -sS https://getcomposer.org/installer | php'
end

desc 'Install laravel.'
task :get_laravel do
  sh 'git remote add laravel https://github.com/laravel/laravel.git'
  sh 'git fetch laravel'
  sh 'git --work-tree=src/app/sys merge laravel/master'
  sh 'composer.phar --working-dir=src/app/sys install'
end

# Package managers

desc 'Update or install composer packages.'
task :update_composer do
  sh 'composer.phar update --no-dev'
end

desc 'Update gems with bundle'
task :update_gems do
  sh 'bundle update --verbose'
end

# Maintenance

desc 'Backup everything inside and below current folder into backup.tar.gz.'
task :backup do

  file = 'backup.tar.gz'
  tar  = "tar -caf #{file} ./{*,.??*}"

  rm file, { verbose: true } if File.exists? file
  sh tar
end

# Git

desc 'Stage changes to git. Auto-remove deleted files.'
task :stage do

  # http://tylerfrankenstein.com/code/how-git-rm-all-deleted-files-shown-git-status
  # http://www.cyberciti.biz/faq/bash-scripting-using-awk/

  del = `git status --porcelain | awk '/^(\sD|DD)/ {print $2}'`

  sh "git rm #{del}" if File.exists? del
  sh 'git add .'
  sh 'git status'
end
