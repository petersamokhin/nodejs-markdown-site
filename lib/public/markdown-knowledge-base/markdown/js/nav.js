$(document).ready(function () {
  let treeItem = $('.tree-item-title')

  treeItem.click((e) => {
    let element = $(e.target)
    let item = $(element.closest('.tree-item')[0])
    let title = $(element.closest('.tree-item-title')[0])

    item.toggleClass('_closed')
    item.toggleClass('_opened')
    title.toggleClass('is_active')
  })
})
