# frozen_string_literal: true

require "cable_ready/installer"

initializer = CableReady::Installer.action_cable_initializer_working_path.read

proceed = false

if initializer.exclude? "PermessageDeflate.configure"
  proceed = if CableReady::Installer.options.key? "compression"
    CableReady::Installer.options["compression"]
  else
    !no?("✨ Configure Action Cable to compress your WebSocket traffic with gzip? (Y/n)")
  end
end

if proceed
  if !CableReady::Installer.gemfile.match?(/gem ['"]permessage_deflate['"]/)
    CableReady::Installer.add_gem "permessage_deflate@>= 0.1"
  end

  # add permessage_deflate config to Action Cable initializer
  if initializer.exclude? "PermessageDeflate.configure"
    CableReady::Installer.create_or_append(CableReady::Installer.action_cable_initializer_working_path, verbose: false) do
      <<~RUBY
        module ActionCable
          module Connection
            class ClientSocket
              alias_method :old_initialize, :initialize
              def initialize(env, event_target, event_loop, protocols)
                old_initialize(env, event_target, event_loop, protocols)
                @driver.add_extension(
                  PermessageDeflate.configure(
                    level: Zlib::BEST_COMPRESSION,
                    max_window_bits: 13
                  )
                )
              end
            end
          end
        end
      RUBY
    end

    say "✅ Action Cable initializer patched to deflate WS traffic"
  else
    say "⏩ Action Cable initializer is already patched to deflate WS traffic. Skipping."
  end
end

CableReady::Installer.complete_step :compression
