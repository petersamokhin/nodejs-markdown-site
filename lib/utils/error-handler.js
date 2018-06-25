import * as Configuration from './configuration'

export function processAllErrors (app) {
  app.use((req, res) => {
    showNotFoundError(res)
  })

  app.use((err, req, res, next) => {
    showThrowableError(res, err)
  })
}

export function showNotFoundError (res) {
  showError(res, 404, 'Page not found, or you do not have sufficient rights to view it.')
}

export function showError (res, code, title, description) {
  Configuration.get(Configuration.DEFAULT_GLOBAL_PATHS_PREFIX, (pathPrefix) => {
    res.status(code).render('error', {
      success: false,
      error_code: code,
      error_title: title,
      error_description: description,
      path_prefix: pathPrefix
    })
  })
}

export function showThrowableError (res, err) {
  Configuration.get(Configuration.DEFAULT_GLOBAL_PATHS_PREFIX, (pathPrefix) => {
    let data = {
      success: false,
      error_code: 500,
      error_title: err.toString(),
      error_description: err.stack,
      path_prefix: pathPrefix
    }

    res.status(data.error_code).render('error', data)
  })
}
