$(document).ready(() => {
  autocomplete(document.getElementById('search-text-mobile'))
  autocomplete(document.getElementById('search-text-pc'))
})

let searchItems

function autocomplete (inp) {
  let currentFocus
  inp.addEventListener('input', function (e) {
    let a, b, i, val = this.value
    closeAllLists()
    if (!val) { return false }
    currentFocus = -1
    a = document.createElement('DIV')
    a.setAttribute('id', this.id + 'autocomplete-list')
    a.setAttribute('class', 'autocomplete-items')
    this.parentNode.appendChild(a)
    for (i = 0; i < searchItems.length; i++) {
      let item = searchItems[i]
      if (item.line.indexOf(val) !== -1) {
        b = document.createElement('div')
        b.innerHTML = `<b>${item.title}</b><br>${item.line.replace(val, '<b>' + val + '</b>')}`
        b.addEventListener('click', function (e) {
          window.location.href = item.path
          closeAllLists()
        })
        a.appendChild(b)
      }
    }
  })
  inp.addEventListener('keydown', function (e) {
    let findText = $(e.target).val()
    if (findText.length > 0) {
      $.ajax({
        type: 'POST',
        url: '/markdown-knowledge-base/search',
        timeout: 200,
        data: {
          text: findText
        },
        success: function (data) {
          searchItems = data
        },
        async: false
      })
    } else {
      searchItems = []
    }
    let x = document.getElementById(this.id + 'autocomplete-list')
    if (x) x = x.getElementsByTagName('div')
    if (e.keyCode === 40) {
      currentFocus++
      addActive(x)
    } else if (e.keyCode === 38) {
      currentFocus--
      addActive(x)
    } else if (e.keyCode === 13) {
      e.preventDefault()
      if (currentFocus > -1) {
        if (x) x[currentFocus].click()
      }
    }
  })

  function addActive (x) {
    if (!x) return false
    removeActive(x)
    if (currentFocus >= x.length) currentFocus = 0
    if (currentFocus < 0) currentFocus = (x.length - 1)
    x[currentFocus].classList.add('autocomplete-active')
  }

  function removeActive (x) {
    for (let i = 0; i < x.length; i++) {
      x[i].classList.remove('autocomplete-active')
    }
  }

  function closeAllLists (elmnt) {
    let x = document.getElementsByClassName('autocomplete-items')
    for (let i = 0; i < x.length; i++) {
      if (elmnt !== x[i] && elmnt !== inp) {
        x[i].parentNode.removeChild(x[i])
      }
    }
  }

  document.addEventListener('click', function (e) {
    closeAllLists(e.target)
  })
}
