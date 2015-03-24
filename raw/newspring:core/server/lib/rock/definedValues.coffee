Rock.definedValues =
  definedTypeGuids:
    suffix: "16F85B3C-B3E8-434C-9094-F3D41F87A740"
    title: "4784CD23-518B-43EE-9B97-225BF6E07846"
    maritalStatus: "B4B92C3F-A935-40E1-A00B-BA484EAD613B"
    status: "8522BADD-2871-45A5-81DD-C76DA07E2E7E"
    phoneType: "8345DD45-73C6-4F5E-BEBD-B77FC83F18FD"


###

  Apollos.definedValues.refresh

  @example refesh defined values from Rock

    Apollos.definedValues.refresh throwErrors

  @param throwErrors [Boolean] switch to silence error throwing

###
Rock.definedValues.refresh = (throwErrors) ->

  filters = []

  for typeName, typeGuid of Rock.definedValues.definedTypeGuids
    filters.push "Guid eq guid'#{typeGuid}'"

  query = "api/DefinedTypes
    ?$expand=
      DefinedValues
    &$select=
      Id,
      Guid,
      DefinedValues/Id,
      DefinedValues/Guid,
      DefinedValues/Value,
      DefinedValues/Description
    &$filter=#{filters.join(' or ')}"

  Rock.apiRequest "GET", query, (error, result) ->
    if error
      message = "#{query.substring(0, 25)}...: #{error}"
      errorType = "Rock sync issue"

      if throwErrors
        throw new Meteor.Error errorType, message
      else
        debug errorType
        debug message

      return

    definedTypes = result.data

    oldCount = Apollos.definedValues.find().count()
    debug "Removing #{oldCount} defined values in anticipation of sync"
    Apollos.definedValues.remove {}

    for definedType in definedTypes
      for definedValue in definedType.DefinedValues
        Apollos.definedValues.insert
          definedTypeGuid: definedType.Guid
          definedTypeId: definedType.Id
          definedValueId: definedValue.Id
          value: definedValue.Value
          description: definedValue.Description
          definedValueGuid: definedValue.Guid

    newCount = Apollos.definedValues.find().count()
    debug "Synced #{newCount} defined values from Rock"
