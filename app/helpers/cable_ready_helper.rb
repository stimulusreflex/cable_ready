module CableReadyHelper
  include CableReady::StreamName

  def cable_ready_stream_from(streamables)
    tag.div data: {
      controller: "cable-ready-stream-from",
      cable_ready_stream_from_signed_stream_name_value: signed_stream_name(streamables)
    }
  end
end
