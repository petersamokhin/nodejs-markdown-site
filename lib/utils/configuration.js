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
export const SIGN_UP_ALLOWED = 'is_sign_up_allowed'

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
  GIVE_DEFAULT_ROLES_FOR_NEW_PAGES,
  SIGN_UP_ALLOWED
]

const DEFAULT_SETTINGS = [
  {
    'k': TEMPLATE_FILE,
    'v': '/views/page-template.html',
    'type': 'string',
    'title': 'Template for generated HTML pages',
    'description': 'Template with keywords to be replaced with generated HTML'
  }, {
    'k': DEFAULT_PAGES_FOLDER,
    'v': 'Main articles',
    'type': 'string',
    'title': 'Default folder (category) for articles',
    'description': 'Article will be placed to this directory if no other specified.'
  }, {
    'k': DEFAULT_GLOBAL_PATHS_PREFIX,
    'v': '/markdown-site',
    'type': 'string',
    'title': 'Paths prefix',
    'description': 'Prefix for routing and all links (need to restart without rebuild to apply changes)'
  }, {
    'k': SUPER_ADMIN_ROLE,
    'v': 'admin',
    'type': 'string',
    'title': 'God role',
    'description': 'User CAN DO WHATEVER THE FUCK HE WANTS if he has this role'
  }, {
    'k': KEYWORD_MARKDOWN_CONTENT,
    'v': '{markdown}',
    'type': 'string',
    'title': 'Generated HTML content keyword',
    'description': 'This keyword will be replaced with generated HTML from template'
  }, {
    'k': KEYWORD_PAGE_TITLE,
    'v': '{title}',
    'type': 'string',
    'title': 'Page title keyword',
    'description': 'This keyword will be replaced with title specified on page creating'
  }, {
    'k': DEFAULT_ROLES_PAGE,
    'v': ['reader'],
    'type': 'role',
    'title': 'Default roles for pages',
    'description': 'If no roles specified for page on creating, or the page or directory was simply copied to project\'s folder, these roles will be applied to them.'
  }, {
    'k': DEFAULT_ROLES_USER,
    'v': ['reader'],
    'type': 'role',
    'title': 'Default roles for user',
    'description': 'If no roles specified for new users, these roles will be applied to them.'
  }, {
    'k': DELETE_NONEXISTENT_PAGES_INFO_FROM_DATABASE_ON_INDEX,
    'v': true,
    'type': 'boolean',
    'title': 'Remove information about deleted pages',
    'description': 'Is it necessary while indexing to remove information from database about files and folders that were removed'
  }, {
    'k': GIVE_DEFAULT_ROLES_FOR_NEW_PAGES,
    'v': true,
    'type': 'boolean',
    'title': 'Add default roles for copied files',
    'description': 'If it necessary while indexing to add default roles for files (articles and categories) that were simply copied to project\'s folder'
  }, {
    'k': SIGN_UP_ALLOWED,
    'v': false,
    'type': 'boolean',
    'title': 'Is sign up allowed',
    'description': 'Is it allowed to create new accounts from login page'
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
  if (key !== SIGN_UP_ALLOWED) 
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

export function setDefaultSettingsIfNecessary (callback) {
  getAllSettings((err, docs) => {
    if (err) throw err

    if (docs.length < DEFAULT_SETTINGS.length) {
      console.error(`[NEED TO ADD DEFAULT] Settings count: ${docs.length}, expected: ${DEFAULT_SETTINGS.length}`)
      Pair
        .bulkWrite(DEFAULT_SETTINGS.map(item => { return {insertOne: {document: item}} }))
        .then(() => {
          callback(DEFAULT_SETTINGS.filter(item => item.key === DEFAULT_GLOBAL_PATHS_PREFIX)[0])
        })
    } else {
      console.debug(`[ALL IS OK] Settings count: ${docs.length}, expected: ${DEFAULT_SETTINGS.length}`)
      get(DEFAULT_GLOBAL_PATHS_PREFIX, pathPrefix => callback(pathPrefix))
    }
  })
}
