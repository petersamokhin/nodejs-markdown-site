import Pair from '../models/kvpair'

export const TEMPLATE_FILE = 'markdown_to_html_template'
export const DEFAULT_PAGES_FOLDER = 'default_folder_for_pages'
export const DEFAULT_GLOBAL_PATHS_PREFIX = 'default_path_prefix'
export const SUPER_ADMIN_ROLE = 'super_admin_role'
export const KEYWORD_MARKDOWN_CONTENT = 'keyword_md_content'
export const KEYWORD_PAGE_TITLE = 'keyword_md_title'
export const DEFAULT_ROLES_PAGE = 'default_roles_page'
export const DEFAULT_ROLES_USER = 'default_roles_user'
export const DELETE_NONEXISTENT_PAGES_INFO_FROM_DATABASE_ON_INDEX = 'delete_bad_pages_info_from_db'
export const GIVE_DEFAULT_ROLES_FOR_NEW_PAGES = 'give_default_roles_for_new_pages'

export const ALL_SETTINGS_KEYS = [
  TEMPLATE_FILE,
  DEFAULT_PAGES_FOLDER,
  DEFAULT_GLOBAL_PATHS_PREFIX,
  SUPER_ADMIN_ROLE,
  KEYWORD_MARKDOWN_CONTENT,
  KEYWORD_PAGE_TITLE,
  DEFAULT_ROLES_PAGE,
  DEFAULT_ROLES_USER,
  DELETE_NONEXISTENT_PAGES_INFO_FROM_DATABASE_ON_INDEX,
  GIVE_DEFAULT_ROLES_FOR_NEW_PAGES
]

const DEFAULT_SETTINGS = [
  {
    'k': TEMPLATE_FILE,
    'v': '/views/page-template.html',
    'type': 'string',
    'title': 'Путь до шаблона страницы',
    'description': 'Ключевые слова в теле этого шаблона будут заменены на заголовок и сгенерированный из Markdown-a HTML-контент'
  }, {
    'k': DEFAULT_PAGES_FOLDER,
    'v': 'Main articles',
    'type': 'string',
    'title': 'Папка для статей по умолчанию (главная)',
    'description': 'Если не указать путь до папки при создании статьи, то она добавится в эту папку. Также эта папка будет закреплена наверху документации.'
  }, {
    'k': DEFAULT_GLOBAL_PATHS_PREFIX,
    'v': '/markdown-knowledge-base',
    'type': 'string',
    'title': 'Префикс для путей',
    'description': ''
  }, {
    'k': SUPER_ADMIN_ROLE,
    'v': 'admin',
    'type': 'string',
    'title': 'Право доступа, дарующее силу бога',
    'description': 'Вне зависимости от остальных прав, пользователь с этими правами CAN DO WHATEVER THE FUCK HE WANTS'
  }, {
    'k': KEYWORD_MARKDOWN_CONTENT,
    'v': '{markdown}',
    'type': 'string',
    'title': 'Ключевое слово для контента',
    'description': 'Будет заменено в шаблоне страницы на сгенерированный контент'
  }, {
    'k': KEYWORD_PAGE_TITLE,
    'v': '{title}',
    'type': 'string',
    'title': 'Ключевое слово для заголовка',
    'description': 'Будет заменено в шаблоне страницы на заголовок'
  }, {
    'k': DEFAULT_ROLES_PAGE,
    'v': ['reader'],
    'type': 'role',
    'title': 'Права доступа к путям по умолчанию',
    'description': 'При добавлении папок и файлов вручную в нужную папку без указания прав, для них будут установлены права по умолчанию после индексации (при каждом просмотре любой сгенерированной страницы)'
  }, {
    'k': DEFAULT_ROLES_USER,
    'v': ['reader'],
    'type': 'role',
    'title': 'Права доступа пользователя по умолчанию',
    'description': 'Права пользователя после регистрации'
  }, {
    'k': DELETE_NONEXISTENT_PAGES_INFO_FROM_DATABASE_ON_INDEX,
    'v': true,
    'type': 'boolean',
    'title': 'Удалять информацию о удалённых статьях',
    'description': 'Стоит ли при индексации удалять из базы данных информацию о статьях и папках, которых нет на диске'
  }, {
    'k': GIVE_DEFAULT_ROLES_FOR_NEW_PAGES,
    'v': true,
    'type': 'boolean',
    'title': 'Добавлять ли права по умолчанию для добавленных на диск статей',
    'description': 'Стоит ли при индексации, если на диске найдены новые папки или статьи, а информации в базе данных о них нет, добавлять права по умолчанию'
  }
]

export function get (key, callback) {
  console.log('Configuration.get ' + key)
  Pair.findByKey(key, (err, pair) => {
    if (err) throw err
    callback(pair.v)
  })
}

export function getDoc (key, callback) {
  console.log('Configuration.getDoc ' + key)
  Pair.findByKey(key, (err, pair) => {
    if (err) throw err
    callback(pair)
  })
}

export function getSeveral (callback, ...keys) {
  const result = []
  Pair.findByKeys(keys, (err, pairs) => {
    if (err) throw err

    pairs.forEach((item) => {
      result[keys.indexOf(item.k)] = item.v
    })

    console.error(`getSeveral: keys=${JSON.stringify(keys)}, result=${JSON.stringify(result)}`)
    callback(result)
  })
}

export function change (key, doc) {
  Pair.findOneAndUpdate({k: key}, {
    $set: doc
  }, {upsert: true}, (err) => {
    if (err) throw err
  })
}

export function getAllSettings (callback) {
  Pair.find({}, (err, docs) => {
    callback(err, docs)
  })
}

export function setDefaultSettingsIfNecessary () {
  getAllSettings((err, docs) => {
    if (err) throw err

    if (docs.length < DEFAULT_SETTINGS.length) {
      console.error(`[NEED TO ADD DEFAULT] Settings count: ${docs.length}, expected: ${DEFAULT_SETTINGS.length}`)
      DEFAULT_SETTINGS.forEach(item => {
        change(item.k, item)
      })
    } else {
      console.debug(`[ALL IS OK] Settings count: ${docs.length}, expected: ${DEFAULT_SETTINGS.length}`)
    }
  })
}
