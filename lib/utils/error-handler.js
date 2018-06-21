export function processAllErrors (app) {
  app.use((req, res) => {
    showNotFoundError(res)
  })

  app.use((err, req, res, next) => {
    showThrowableError(res, err)
  })
}

export function showNotFoundError (res) {
  showError(res, 404, 'Страница не найдена, либо недостаточно прав для её просмотра')
}

export function showError (res, code, title, description) {
  res.status(code).render('error', {
    success: false,
    error_code: code,
    error_title: title,
    error_description: description
  })
}

export function showThrowableError (res, err) {
  let data = {
    success: false,
    error_code: 500,
    error_title: err.toString(),
    error_description: err.stack
  }

  res.status(data.error_code).render('error', data)
}
