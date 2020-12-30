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
