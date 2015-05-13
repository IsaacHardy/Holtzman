console.log Apollos.Forms
class Apollos.Forms.Input extends Apollos.Component

  @register "Apollos.Forms.Input"


  vars: -> [

    error: null
    status: null
    value: null

  ]

  events: -> [

    "focus input": @.focused


    "blur input": @.blurred

    # can this be a change event?
    "focus input, keyup input, blur input": @.changed


    "focus input, keyup input": @.active

  ]


  onRendered: ->

    self = @

    if self.data()?.preFill
      self.value.set self.data().preFill


  focused: (event) ->

    self = @

    # switch to junction when ready
    $(event.target.parentNode)
      .addClass "input--active"

    parent = self.parent()
    if parent.find("form")
      parent.hasErrors.set false


  blurred: (event) ->

    self = @
    parent = self.parent()
    isForm = parent.find("form")
    data = self.data()

    if event.target.value and data.validate
      validateFunction = data.validate
      valid = Apollos.validate[validateFunction] event.target.value

      if not valid
        self.error.set true
        self.status.set data.errorText
        if isForm
          parent.hasErrors.set true

      return

    # reset parent errors
    # code for reset parent errors
    if isForm
      parent.hasErrors.set false


    # if the input is empty, remove the input--active class
    if not event.target.value

      # switch to junction when ready
      $(event.target.parentNode)
        .removeClass "input--active"


  changed: (event) ->
    self = @
    # bind the value to the template
    self.value.set event.target.value


  active: (event) ->
    self = @
    # remove the error becuase they are doing something
    self.error.set false
    self.status.set false


  setStatus: (status, isError) ->

    self = @

    if not isError and typeof status is "boolean"
      isError = status

      data = self.data()
      if isError
        status = data.errorText
      else
        status = data.statusText

    self.status.set status
    self.error.set isError


  getValue: ->

    return @.value.get()


  setValue: (value) ->

    @.value.set value

    if value
      @.find("input").value = value
      return

console.log Apollos.Forms
