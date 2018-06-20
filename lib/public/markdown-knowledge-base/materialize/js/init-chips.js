$(document).ready(() => {
  $('.chips-placeholder').chips({
    placeholder: 'Enter после каждого',
    secondaryPlaceholder: '+ Ещё права'
  })

  $('.chips-initial').chips({
    data: [{
      tag: 'reader'
    }]
  })

  // $('#chips-placeholder > input').attr('name', 'new-roles')
})
