class GlobalIdableEntity
  include GlobalID::Identification
  include CableReady::Broadcastable

  def id
    "fake-id"
  end

  def self.find(id)
    new if id == "fake-id"
  end

  def fake_update
    ModelBroadcasterCallbacks.new(:update).after_commit(self)
  end
end
