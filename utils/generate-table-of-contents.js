const globalConfig = require(`../config/global-config`);
const cheerio = require('cheerio');
const dirTree = require('directory-tree');
const fs = require('fs');

function linkElementToHtml(element) {
    return `<div class="tree-item tree-leaf js-item js-leaf  _closed">
                        <a href="${element.path}" class="tree-item-title tree-leaf-title js-item-title js-leaf-title">
                            <span class="marker"></span>
                            <span class="text">${element.name}</span>
                        </a>
                    </div>`;
}

function folderElementToHtml(element) {
    let template = `
                <div class="tree-item tree-branch js-item js-branch _closed" data-id="${element.name}">
                    <div class="tree-item-title tree-branch-title js-item-title js-branch-title">
                        <div class="marker"></div>
                        <div class="text">${element.name}</div>
                    </div>
                </div>`;

    let $ = cheerio.load(template);

    element.children.forEach(child => {
        let childHtml;
        switch (child.type) {
            case 'directory': {
                childHtml = folderElementToHtml(child);
                break;
            }
            case 'file': {
                childHtml = linkElementToHtml(child);
                break;
            }
            default:
                throw new Error('Unknown node type ' + child.type)
        }

        $('.tree-item').first().append(childHtml);
    });

    return $('.tree-item').first().parent().html();
}

function generateNavigationByNodes(nodes) {
    let template = `<aside class="g-3 left-align" id="generated-nav">
        <div class="js-side-tree-nav">
            <nav class="side-tree-nav side-tree-nav-fix">

            </nav>
        </div>
    </aside>`;
    let $ = cheerio.load(template);
    let nav = $('nav');

    let html = '';
    nodes.forEach(node => {
        switch (node.type) {
            case 'directory': {
                html = folderElementToHtml(node);
                break;
            }
            case 'file': {
                html = linkElementToHtml(node);
                break;
            }
            default:
                throw new Error('Unknown node type: ' + node.type);
        }
        nav.append(html);
    });

    return $('aside').parent().html();
}

const walkSync = (dir, filelist) => {
    let files = fs.readdirSync(dir);
    filelist = filelist || [];
    files.forEach((file) => {
        if (fs.statSync(path.join(dir, file)).isDirectory()) {
            filelist = walkSync(path.join(dir, file), filelist);
        }
        else {
            filelist.push(path.join(dir, file));
        }
    });
    return filelist;
};

function generateNavigationForFolder(folder) {
    const tree = dirTree(folder, {extensions: /\.md/}, (item) => {
        item.path = globalConfig.markdown_pages_navigation_links_prefix + item.path.substring(item.path.indexOf('pages')).replace('.md', '')
    });
    return generateNavigationByNodes(tree.children);
}

module.exports = generateNavigationForFolder;