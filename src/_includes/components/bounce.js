const cache = new Map();

module.exports = async ({ path, check_path = 'src/static/' + path, type = "css"  }) => {
    // caching hashes significantly speeds up build time
    var hash = undefined;
    if (cache.get(check_path)) {
        hash = cache.get(check_path);
    } else {
        hash = revision = require('child_process')
        .execSync(`git rev-list HEAD -1 -- ${check_path}`)
        .toString().trim().slice(0, 7);
        cache.set(check_path, hash);
    }

    if (type == "css") {
        return `<link rel="stylesheet" href="${path}?h=${hash}"/>\n`;
    } else if (type == "js") {
        return `<script src="${path}?h=${hash}"></script>\n`;
    } else {
        throw new Error('undefined bounce type');
    }
}