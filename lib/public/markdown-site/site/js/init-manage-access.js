$(document).ready(() => {
  let pathSelect = $('#path-select')
  let userSelect = $('#user-select')

  showCurrentPathRoles()
  showCurrentUserRoles()

  pathSelect.on('change', function () {
    showCurrentPathRoles()
  })

  userSelect.on('change', function () {
    showCurrentUserRoles()
  })

  function showCurrentPathRoles () {
    getPathRoles(pathSelect.val(), function (roles) {
      $('#current-path-roles').html('<b>Current path\'s roles:</b> ' + roles.join(', '))

      selectCurrentPathRoles(roles)
    })
  }

  function showCurrentUserRoles () {
    getUserRoles(userSelect.val(), function (roles) {
      $('#current-user-roles').html('<b>Current user\'s roles:</b> ' + roles.join(', '))

      selectCurrentUserRoles(roles)
    })
  }

  function getPathRoles (path, callback) {
    $.post('manage-access/get-path-roles', {path: path}, function (data) {
      callback(data.roles)
    })
  }

  function getUserRoles (login, callback) {
    $.post('manage-access/get-user-roles', {login: login}, function (data) {
      callback(data.roles)
    })
  }

  function selectCurrentUserRoles (roles) {
    $('#user-roles').children().each(function (ind, item) {
      if (roles.indexOf($(item).val()) !== -1) {
        $(item).attr('selected', '')
      } else {
        $(item).removeAttr('selected')
      }
    })
  }

  function selectCurrentPathRoles (roles) {
    $('#path-roles').children().each(function (ind, item) {
      if (roles.indexOf($(item).val()) !== -1) {
        $(item).attr('selected', '')
      } else {
        $(item).removeAttr('selected')
      }
    })
  }
})