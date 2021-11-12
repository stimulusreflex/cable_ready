class GlobalIdableEntity
  include GlobalID::Identification
  include CableReady::Updatable

  def id
    "fake-id"
  end

  def self.find(id)
    new if id == "fake-id"
  end

  def fake_update
    ModelUpdatableCallbacks.new(:update).after_commit(self)
  end
end
