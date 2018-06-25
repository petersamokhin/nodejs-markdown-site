var editor;

$(document).ready(() => {
  editor = CodeMirror.fromTextArea(document.getElementById('markdown-input'), {
    mode: 'markdown',
    extraKeys: {'Enter': 'newlineAndIndentContinueMarkdownList'}
  })
  let code = $('#markdown-input-label').find('div').first()
  code.addClass('codemirror_textarea')
})