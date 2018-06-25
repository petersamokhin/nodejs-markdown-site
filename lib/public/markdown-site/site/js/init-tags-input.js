function initTagsInput () {
  $('input[type="tags"]').each((i, item) => {
    window[item.id + '_fun'] = tagsInput(item)
  })
}