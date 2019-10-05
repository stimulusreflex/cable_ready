# Dataset Mutations

## [setDatasetProperty](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/dataset)

Sets an dataset property \(data-\* attribute\) on an element.

```ruby
cable_ready["MyChannel"].set_dataset_property(
  selector: "string", # required - string containing a CSS selector or XPath expression
  name:     "string", # required - the property to set
  value:    "string"  # [null]   - the value to assign to the dataset
)
```

### JavaScript Events

* `cable-ready:before-set-dataset-property`
* `cable-ready:after-set-dataset-property`

