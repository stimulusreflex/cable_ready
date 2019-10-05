---
description: Example of using an XPath selector with CableReady
---

# XPath Example

{% code-tabs %}
{% code-tabs-item title="app/models/user.rb" %}
```ruby
class User < ApplicationRecord
  include CableReady::Broadcaster

  def broadcast_name_change
    cable_ready["UserChannel"].text_content selector: "/html/body/div[1]/form/input[1]", text: name, xpath: true
    cable_ready.broadcast
  end
end
```
{% endcode-tabs-item %}
{% endcode-tabs %}

