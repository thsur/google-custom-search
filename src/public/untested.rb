#!/usr/bin/env ruby

$app   = []
$tests = []

Dir.glob('app/scripts/**/*.js') do |filename|
  $app.push(filename.slice(/scripts\/(.*)/, 1))
end

Dir.glob('test/spec/**/*.js') do |filename|
  $tests.push(filename.slice(/spec\/(.*)/, 1))
end

def tested
  $tests
end

def untested
  $app - $tests
end

if $0 == __FILE__

  puts 'Optional flags: -t, --tested'
  puts

  if ARGV[0] =~ /^(-t)$|^(--tested)$/
    puts 'Test suites found for:'
    puts
    puts tested
  else
    puts 'Test suites missing for:'
    puts
    puts untested
  end
end
