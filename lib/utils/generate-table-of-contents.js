import cheerio from 'cheerio'
import dirTree from 'directory-tree'
import { getAccessMapForFolderChildren } from '../config/access-configurator'
import * as Configuration from '../utils/configuration'

/**
 * Recursive on-the-fly generating of pages navigation
 * based on file tree and access rights of user.
 */
export default function generateNavigationForFolder (folder, userRoles, callback) {
  const tree = dirTree(folder, {extensions: /\.md/}, (item) => {
    item.path = item.path.substring(item.path.indexOf('/pages')).replace('.md', '')
    item.name = item.name.replace('.md', '')
  })
  tree.children.forEach(item => {
    validatePathsRecursive(item)
  })

  getAccessMapForFolderChildren(folder, userRoles, map => {
    generateNavigationByNodes(tree.children, map, callback)
  })
}

/**
 * File tree returned by library has absolute paths.
 * Convert them to relative and remove the file extensions.
 */
function validatePathsRecursive (item) {
  item.path = item.path.substring(item.path.indexOf('/pages')).replace('.md', '')
  item.name = item.name.replace('.md', '')

  if (item.children) {
    item.children.forEach(i => validatePathsRecursive(i))
  }
}

function generateNavigationByNodes (nodes, map, callback) {
  Configuration.getSeveral((items) => {
    let template = `
      <aside class="g-3 left-align" id="generated-nav">
          <div class="js-side-tree-nav">
              <nav class="side-tree-nav side-tree-nav-fix" id="nav-generated-inner">

              </nav>
          </div>
      </aside>`
    let $ = cheerio.load(template)
    let nav = $('nav')

    nodes = nodes
      .sort((x, y) => x.path.toLowerCase().localeCompare(y.path.toLowerCase()))
      .sort((x, y) => x.path === '/pages/' + items[0] ? -1 : y.path === '/pages/' + items[0] ? 1 : 0)

    nodes.forEach(node => {
      switch (node.type) {
        case 'directory': {
          if (map.get(node.path)) {
            nav.append(folderElementToHtml(node, map, items[1]))
          }
          break
        }
        case 'file': {
          if (map.get(node.path)) {
            nav.append(linkElementToHtml(node, items[1]))
          }
          break
        }
        default:
          throw new Error(`Unknown node type: ${node.type}`)
      }
    })

    callback($('aside').parent().html())
  }, Configuration.DEFAULT_PAGES_FOLDER, Configuration.DEFAULT_GLOBAL_PATHS_PREFIX)
}

function linkElementToHtml (element, prefix) {
  return `<div class="tree-item tree-leaf js-item js-leaf _closed">
                        <a href="${prefix + element.path}" class="tree-item-title tree-leaf-title js-item-title js-leaf-title"  data-path="${element.path}">
                            <span class="marker"></span>
                            <span class="text">${element.name}</span>
                        </a>
                    </div>`
}

function folderElementToHtml (element, map, prefix) {
  let template = `
                <div class="tree-item tree-branch js-item js-branch _closed" data-id="${element.name}" data-path="${element.path}">
                    <div class="tree-item-title tree-branch-title js-item-title js-branch-title" data-path="${element.path}">
                        <div class="marker"></div>
                        <div class="text">${element.name}</div>
                    </div>
                </div>`

  let treeItem = cheerio.load(template)('.tree-item').first()

  element.children.forEach(node => {
    switch (node.type) {
      case 'directory': {
        if (map.get(node.path)) {
          treeItem.append(folderElementToHtml(node, map, prefix))
        }
        break
      }
      case 'file': {
        if (map.get(node.path)) {
          treeItem.append(linkElementToHtml(node, prefix))
        }
        break
      }
      default:
        throw new Error(`Unknown node type: ${node.type}`)
    }
  })

  return treeItem.parent().html()
}
