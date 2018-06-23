import Pair from '../models/kvpair'

export const TEMPLATE_FILE = 'markdown_to_html_template'
export const DEFAULT_PAGES_FOLDER = 'default_folder_for_pages'
export const DEFAULT_GLOBAL_PATHS_PREFIX = 'default_path_prefix'
export const SUPER_ADMIN_ROLE = 'super_admin_role'
export const KEYWORD_MARKDOWN_CONTENT = 'keyword_md_content'
export const KEYWORD_PAGE_TITLE = 'keyword_md_title'
export const DEFAULT_ROLES_USER = 'default_roles_user'
export const DEFAULT_ROLES_PAGE = 'default_roles_page'
export const DELETE_NONEXISTENT_PAGES_INFO_FROM_DATABASE_ON_INDEX = 'delete_bad_pages_info_from_db'
export const GIVE_DEFAULT_ROLES_FOR_NEW_PAGES = 'give_default_roles_for_new_pages'

export function get (key, callback) {
  console.log('Configuration.get ' + key)
  Pair.findByKey(key, (err, pair) => {
    if (err) throw err
    callback(pair.v)
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

export function change (key, value, type, title, descr) {
  Pair.findOneAndUpdate({k: key}, {
    $set: {
      v: value,
      type: type,
      title: title,
      description: descr
    }
  }, {upsert: true}, (err) => {
    if (err) throw err
  })
}
