$('.sidenav').sidenav()

$('.tabs').tabs()

$('#tab-all-settings').click(() => {
  $('#admin-settings').fadeIn(200)
  $('#access-settings').fadeOut(200)
})

$('#tab-access-settings').click(() => {
  $('#admin-settings').fadeOut(200)
  $('#access-settings').fadeIn(200)
})

$(document).ready(() => {
  let settingsWrapper = $('#admin-settings-form')
  $.post('manage-access/get-all-settings').done((data) => {
    data.settings.forEach((item, index) => {
      let html, title

      switch (item.type) {
        case 'string': {
          title = `<div class="col s12 settings-title"><h6>${item.title}</h6></div>`
          html = `<div class="input-field col s12 m11 left-align"><input name="${item.k}" id="${item.k}" type="text" placeholder="${item.v}"/><label class="active settings-label" for="${item.k}">${item.description}</label></div>`
          break
        }
        case 'boolean': {
          let checkedInfo = ''
          if (item.v === true) checkedInfo = 'checked'
          title = `<div class="col s12"><h6>${item.title}</h6><div class="switch-descr">${item.description}</div></div>`
          html = `<div class="switch">
    <label>
      <input type="checkbox" style="display: none;" name="${item.k}" ${checkedInfo} onclick="if (this.checked) { $(this).attr('checked', 'true') } else { $(this).removeAttr('checked') }">
      <span class="lever"></span>
    </label>
  </div>`
          break
        }
        case 'role': {
          title = `<div class="col s12"><h6>${item.title}</h6><div class="switch-descr">${item.description}</div></div>`
          html = `<div class="input-field col s12 m11 left-align">
                <input class="autocomplete" name="${item.k}" id="${item.k}" type="tags" placeholder="${item.v}"/>
            </div>`
          break
        }
        default: {
          console.error(JSON.stringify(item))
        }
      }
      settingsWrapper.append(title + html)
      if (index === 1) {
        settingsWrapper.append(`<button type="submit" class="btn-floating btn-large waves-effect waves-light indigo right col" id="submit-btn-create"><i class="material-icons">done</i></button>`)
      }
    })

    initTagsInput()

    $('div.tags-input > input').autocomplete({
      data: data.ALL_AVAILABLE_ROLES,
      onAutocomplete: (text, el) => { window[el.attr('id').replace('_tags', '') + '_fun']() }
    })
  })
})
