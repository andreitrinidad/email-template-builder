
const listAllFilesAndDirs = async (dirHandle, whiteListFiles = [], whiteListDirectories = [], showFilesOnly = false) => {
    let files = [];
    let filesOnly = [];
    for await (let [name, handle] of dirHandle) {
        const { kind } = handle;
        if (handle.kind === 'directory') {
            if (whiteListDirectories.length <= 0 || whiteListDirectories.includes(name)) {
                files.push({ name, handle, kind, files: [...await listAllFilesAndDirs(handle, whiteListFiles, whiteListDirectories, showFilesOnly)] });
            }
        } else {
            const fileType = name.split('.')[1];
            if (whiteListFiles.length <= 0 || whiteListFiles.includes(fileType)) {
                files.push({ name, handle, kind });
                filesOnly.push({ name, handle, kind });
            }
        }
    }

    // if (showFilesOnly) return filesOnly;
    // console.log(`filesOnly`, filesOnly)
    return files;
}

export default listAllFilesAndDirs;