# frozen_string_literal: true

CableReady.configure do |config|
  # Enable/disable exiting / warning when the sanity checks fail options:
  # `:exit` or `:warn` or `:ignore`

  # config.on_failed_sanity_checks = :exit

  # Enable/disable exiting / warning when there's a new CableReady release
  # `:exit` or `:warn` or `:ignore`

  # config.on_new_version_available = :ignore

  # Specify operations payload output format, options:
  # `:cable_ready` or `:turbo_stream`

  # config.operation_mode = :turbo_stream

  # Define your own custom operations
  # https://cableready.stimulusreflex.com/customization#custom-operations

  # config.add_operation_name :jazz_hands
end
