# frozen_string_literal: true

require "anyway_config"

module CableReady
  # CableReady configuration
  class Config < Anyway::Config
    config_name :cable_ready

    attr_config detail_case: "camel" # "camel" [default], "snake", "pascal", "kebab", "keep" [keeps original]
  end
end
