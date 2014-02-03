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
task :install_composer do
  sh 'curl -sS https://getcomposer.org/installer | php'
end

desc 'Install Silex.'
task :install_silex do

  # We need Angular's dir structure, so make sure it's created.

  if Dir.exists?('src/public/app')
    Rake::Task['install_angular'].invoke
  end

  Rake::Task['update_composer'].invoke

  # Create an empty Silex bootstrap/app file.

  sh 'touch src/public/app/connect.php';
  sh 'chmod 744 src/public/app/connect.php';
end

desc 'Install Angular.'
task :install_angular do
  cd('src/public') do
    sh 'yo angular'
  end
end

# Package managers

desc 'Update Composer packages.'
task :update_composer do
  sh 'composer.phar update --verbose'
end

desc 'Update Bower packages.'
task :update_bower do
  sh 'bower update --verbose'
end

desc 'Update Ruby gems.'
task :update_gems do
  sh 'bundle update --verbose'
end

# Maintenance

desc 'Backup everything inside and below the current folder into backup.tar.gz.'
task :backup do

  file = 'backup.tar.gz'
  excl = '--exclude=src/sys/vendor --exclude=src/public/node_modules --exclude=src/public/app/bower_components'
  tar  = "tar -caf #{file} #{excl} ./{*,.??*}"

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
