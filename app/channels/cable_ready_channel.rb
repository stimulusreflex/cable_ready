##
# This was taken from turbo-rails
# https://github.com/hotwired/turbo-rails/blob/cacc19666f075416976cafcb2ee8e58ff68fad0d/app/channels/turbo/streams_channel.rb

class CableReadyChannel < ActionCable::Channel::Base
  include CableReady::StreamName

  def subscribed
    verified_stream_name = verified_stream_name(params[:signed_stream_name])
    if verified_stream_name
      stream_from verified_stream_name
    else
      reject
    end
  end
end
