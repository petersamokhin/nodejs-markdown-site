import cheerio from 'cheerio'
import dirTree from 'directory-tree'
import { getAccessMapForFolderChildren } from '../config/access-configurator'
import globalConfig from '../config/global-config'

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
  let template = `
      <aside class="g-3 left-align" id="generated-nav">
          <div class="js-side-tree-nav">
              <nav class="side-tree-nav side-tree-nav-fix" id="nav-generated-inner">

              </nav>
          </div>
      </aside>`
  let $ = cheerio.load(template)
  let nav = $('nav')

  nodes = nodes.sort(function (x, y) { return x.path === '/pages/' + globalConfig.main_pages_folder ? -1 : y.path === '/pages/' + globalConfig.main_pages_folder ? 1 : 0 })

  nodes.forEach(node => {
    switch (node.type) {
      case 'directory': {
        if (map.get(node.path)) {
          nav.append(folderElementToHtml(node, map))
        }
        break
      }
      case 'file': {
        if (map.get(node.path)) {
          nav.append(linkElementToHtml(node))
        }
        break
      }
      default:
        throw new Error(`Unknown node type: ${node.type}`)
    }
  })

  callback($('aside').parent().html())
}

function linkElementToHtml (element) {
  return `<div class="tree-item tree-leaf js-item js-leaf _closed">
                        <a href="${globalConfig.markdown_pages_navigation_links_prefix + element.path}" class="tree-item-title tree-leaf-title js-item-title js-leaf-title"  data-path="${element.path}">
                            <span class="marker"></span>
                            <span class="text">${element.name}</span>
                        </a>
                    </div>`
}

function folderElementToHtml (element, map) {
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
          treeItem.append(folderElementToHtml(node, map))
        }
        break
      }
      case 'file': {
        if (map.get(node.path)) {
          treeItem.append(linkElementToHtml(node))
        }
        break
      }
      default:
        throw new Error(`Unknown node type: ${node.type}`)
    }
  })

  return treeItem.parent().html()
}
