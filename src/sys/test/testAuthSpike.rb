#--!/usr/bin/env ruby

require 'curb'

require 'net/http'

# Adjust this
endpoint = 'http://localhost/_tinlizzy/src/sys/test/spikes/authentication.php'

# Main

class Client

  attr_reader :endpoint, :http

  def request (request)
    {request: request, response: @http.request(request)}
  end

  def post (path, data)
    request = Net::HTTP::Post.new(@endpoint.path + path)
    request.set_form_data(data)
    self.request request
  end

  def get (path)
    self.request Net::HTTP::Get.new(@endpoint.path + path)
  end

  def initialize (url)
    @endpoint = (URI === url) ? url : URI(url)
    @http = Net::HTTP.new(@endpoint.host, @endpoint.port)
  end
end

=begin

http = Net::HTTP.new('profil.wp.pl', 443)
http.use_ssl = true
path = '/login.html'

# GET request -> so the host can set his cookies
resp, data = http.get(path, nil)
cookie = resp.response['set-cookie'].split('; ')[0]


# POST request -> logging in
data = 'serwis=wp.pl&url=profil.html&tryLogin=1&countTest=1&logowaniessl=1&login_username=blah&login_password=blah'
headers = {
  'Cookie' => cookie,
  'Referer' => 'http://profil.wp.pl/login.html',
  'Content-Type' => 'application/x-www-form-urlencoded'
}

resp, data = http.post(path, data, headers)

# Output on the screen -> we should get either a 302 redirect (after a successful login) or an error page
puts 'Code = ' + resp.code
puts 'Message = ' + resp.message
resp.each {|key, val| puts key + ' = ' + val}
puts data

=end

def dump(request, result)

  out = "#{request.method} #{request.path}\n";

  [request, result].each do |i|

    out << "\n#{i.code} #{i.message}\n" if i.respond_to? :code

    i.each_header {|header, value| out << "#{header}: #{value}\n"}

    out << "body: #{i.body}\n" if i.body
  end

  puts out << "\n"
end

client = Client.new(endpoint)

# p client.get('/public')
# p client.get('/private')
# p client.get('/private/honeypot')

result = client.get('/public')

p result.fetch(:response).response
p result.fetch(:response).response['set-cookie'].split('; ')[0]

exit

# p result.fetch(:request).method
# p result.fetch(:request).path
# p result.fetch(:request).to_hash
# p result.fetch(:response).to_hash

# result.fetch(:response).header.each_header do |k, v|
#   puts "#{k} = #{v}"
# end

# p result.fetch(:response).header.to_hash

result = client.get('/public')
dump(result.fetch(:request), result.fetch(:response))

result = client.post('/private/login_check', {_username: 'admin', _password: 'foo'})
dump(result.fetch(:request), result.fetch(:response))


#p res.header.each_header {|key,value| puts "#{key} = #{value}" }

exit

res = client.get('/private')

p res
p res.object_id

########################################

api  = URI(endpoint)
http = Net::HTTP.new(api.host)

res  = http.get(api.path + '/private')

p res
p res.object_id

res  = http.get(api.path + '/private')

p res
p res.object_id

########################################

api  = URI(endpoint)
http = Net::HTTP.new(api.host)

request = Net::HTTP::Get.new(api.path + '/private')
res     = http.request(request)

p res
p res.object_id

http = Net::HTTP.new(api.host)
request = Net::HTTP::Get.new(api.path + '/private')
res     = http.request(request)

p res
p res.object_id

########################################

api  = URI('http://www.example.com')
http = Net::HTTP.new(api.host)

request = Net::HTTP::Get.new(api.path + '/private')
res     = http.request(request)

p res
p res.object_id

request = Net::HTTP::Get.new(api.path + '/private')
res     = http.request(request)

p res
p res.object_id

exit

# res = client.get('/public')
# p res

# res_2 = client.get('/logout')
# p res_2

res_3 = client.get('/private')
p res_3.object_id

res_4 = client.get('/private/honeypot')
p res_4.object_id

p Net::HTTP.get('localhost', '/_tinlizzy/src/sys/test/spikes/authentication.php/public')

res = Net::HTTP.get_response('localhost', '/_tinlizzy/src/sys/test/spikes/authentication.php/private')

p res
p res.inspect
p res.code
p res.message
p res.uri

api = URI(endpoint)

http = Net::HTTP.new(api.host)
res = http.get(api.path << '/private')

p res
p res.inspect
p res.code
p res.message
p res.uri


http = Net::HTTP.new(api.host)
req  = Net::HTTP::Get.new(api.path << '/private/honeypot')
res  = http.request req

p res
p res.inspect
p res.code
p res.message
p res.uri

exit

http = Net::HTTP.new(api.host)
res  = http.request_get api.path << '/private/honeypot'

p res.inspect
p res.code

http = Net::HTTP.new(api.host).start
p http.get(api.path << '/private')
http.finish

exit

# uri = URI(endpoint)
# res = Net::HTTP.get_response(uri)

# puts res.inspect
# puts uri.path.inspect

# uri = URI(endpoint)

# Net::HTTP.start(uri.host, uri.port) do |http|

#   request = Net::HTTP::Get.new uri.path << '/private/honeypot'

#   response = http.request request

#   p request
#   p response
# end

uri  = URI('http://localhost/_tinlizzy/src/sys/test/spikes/authentication.php/login_check')
http = Net::HTTP.new(uri);

# res = Net::HTTP.post_form(uri, {_username: 'admin', _password: 'foo'})
#res = http.request_post(uri, {_username: 'admin', _password: 'foo'})

puts http
#puts res.status

req = Net::HTTP::Post.new(uri)
req.set_form_data('from' => '2005-01-01', 'to' => '2005-03-31')

res = Net::HTTP.start(uri.hostname, uri.port) do |http|
  http.request(req)
end

case res
when Net::HTTPSuccess, Net::HTTPRedirection
  # OK
  p res
else
  p res.value
end

# Net::HTTP.get(uri, '/public')

# http = Net::HTTP.new(endpoint);
# request = Net::HTTP::Get.new('/public')
# response = http.request(request)

# puts response.inspect

# http = Net::HTTP.new('localhost/_tinlizzy/src/sys/test/spikes')


# p response