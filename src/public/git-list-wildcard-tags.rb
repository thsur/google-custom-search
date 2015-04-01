#!/usr/bin/env ruby

lookup = ARGV[0]

puts 'Tags matching ' + lookup
puts %x(git for-each-ref --format="%(refname:short)" refs/tags/#{lookup}*)
