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

desc 'Setup directory structure.'
task :init_dirs do
  sh 'mkdir --parents bin dist src/storage src/sys src/public'
end

desc 'Install Composer.'
task :get_composer do
  sh 'curl -sS https://getcomposer.org/installer | php'
end

desc 'Install Laravel.'
task :get_laravel do
  sh 'composer.phar --working-dir=src/ create-project laravel/laravel sys --prefer-dist'
end

desc 'Install Angular.'
task :init_angular do
  FileUtils.cd('src/public') do
    sh 'yo angular'
  end
end

# Package managers

desc 'Update Composer packages.'
task :update_composer do
  sh 'composer.phar update --no-dev'
end

desc 'Update Bower packages.'
task :update_gems do
  sh 'bundle update --verbose'
end

desc 'Update Ruby gems.'
task :update_gems do
  sh 'bundle update --verbose'
end

# Maintenance

desc 'Backup everything inside and below the current folder into backup.tar.gz.'
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
