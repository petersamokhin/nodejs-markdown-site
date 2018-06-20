export function processAllErrors (app) {
  app.use((req, res) => {
    showNotFoundError(res)
  })

  app.use((err, req, res, next) => {
    showError(res, err)
  })
}

export function showNotFoundError (res) {
  showError(res, 404, 'Страница не найдена, либо недостаточно прав для её просмотра')
}

export function showError (res, err) {
  let data = {
    success: false,
    error_code: 500,
    error_title: err.toString(),
    error_description: err.stack
  }

  res.status(data.error_code).render('error', data)
}
