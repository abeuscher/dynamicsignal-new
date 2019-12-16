// FIXME this function does not work as expected in the case of working in linked pug directories.

function findDirectoryMatch(collection, path) {
    path.pop();
    var output = collection.filter(f => {
                return f.srcDir == "./" + path.join("/") + "/";
                });
    if (output.length > 0) {
        return output;
    } else if (path.length > 1) {
        return findDirectoryMatch(collection,path);
    } else {
        console.log("Error processing " + path);
    }
}

module.exports = findDirectoryMatch;