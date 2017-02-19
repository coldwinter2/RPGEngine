//-----------------------------------------------------------------------------
// StorageManager
//
// The static class that manages storage for saving game data.

function StorageManager() {
    throw new Error('This is a static class');
}

StorageManager.save = function(savefileId, json) {

    this.saveToWebStorage(savefileId, json);
};

StorageManager.load = function(savefileId) {
    return this.loadFromWebStorage(savefileId);
};

StorageManager.exists = function(savefileId) {
    return this.webStorageExists(savefileId);
};

StorageManager.remove = function(savefileId) {
    this.removeWebStorage(savefileId);
};

StorageManager.backup = function(savefileId) {
    if (this.exists(savefileId)) {
            var data = this.loadFromWebStorage(savefileId);
            var compressed = LZString.compressToBase64(data);
            var key = this.webStorageKey(savefileId) + "bak";
            cc.sys.localStorage.setItem(key, compressed);

    }
};

StorageManager.backupExists = function(savefileId) {
    if (this.isLocalMode()) {
        return this.localFileBackupExists(savefileId);
    } else {
        return this.webStorageBackupExists(savefileId);
    }
};

StorageManager.cleanBackup = function(savefileId) {
	if (this.backupExists(savefileId)) {

        var key = this.webStorageKey(savefileId);
        cc.sys.localStorage.removeItem(key + "bak");

	}
};

StorageManager.restoreBackup = function(savefileId) {
    if (this.backupExists(savefileId)) {
        
        var data = this.loadFromWebStorageBackup(savefileId);
        var compressed = LZString.compressToBase64(data);
        var key = this.webStorageKey(savefileId);
        cc.sys.localStorage.setItem(key, compressed);
        cc.sys.localStorage.removeItem(key + "bak","");
    }
};

// never used
// StorageManager.isLocalMode = function() {
//     return cc.sys.isNative;
// };

// StorageManager.saveToLocalFile = function(savefileId, json) {
//     var data = LZString.compressToBase64(json);
//     var fs = require('fs');
//     var dirPath = this.localFileDirectoryPath();
//     var filePath = this.localFilePath(savefileId);
//     if (!fs.existsSync(dirPath)) {
//         fs.mkdirSync(dirPath);
//     }
//     fs.writeFileSync(filePath, data);
// };

// StorageManager.loadFromLocalFile = function(savefileId) {
//     var data = null;
//     var fs = require('fs');
//     var filePath = this.localFilePath(savefileId);
//     if (fs.existsSync(filePath)) {
//         data = fs.readFileSync(filePath, { encoding: 'utf8' });
//     }
//     return LZString.decompressFromBase64(data);
// };

// StorageManager.loadFromLocalBackupFile = function(savefileId) {
//     var data = null;
//     var fs = require('fs');
//     var filePath = this.localFilePath(savefileId) + ".bak";
//     if (fs.existsSync(filePath)) {
//         data = fs.readFileSync(filePath, { encoding: 'utf8' });
//     }
//     return LZString.decompressFromBase64(data);
// };

// StorageManager.localFileBackupExists = function(savefileId) {
//     var fs = require('fs');
//     return fs.existsSync(this.localFilePath(savefileId) + ".bak");
// };

// StorageManager.localFileExists = function(savefileId) {
//     var fs = require('fs');
//     return fs.existsSync(this.localFilePath(savefileId));
// };

// StorageManager.removeLocalFile = function(savefileId) {
//     var fs = require('fs');
//     var filePath = this.localFilePath(savefileId);
//     if (fs.existsSync(filePath)) {
//         fs.unlinkSync(filePath);
//     }
// };

StorageManager.saveToWebStorage = function(savefileId, json) {
    var key = this.webStorageKey(savefileId);
    var data = LZString.compressToBase64(json);
    cc.sys.localStorage.setItem(key, data);
};

StorageManager.loadFromWebStorage = function(savefileId) {
    var key = this.webStorageKey(savefileId);
    var data = localStorage.getItem(key);
    return LZString.decompressFromBase64(data);
};

StorageManager.loadFromWebStorageBackup = function(savefileId) {
    var key = this.webStorageKey(savefileId) + "bak";
    var data = cc.sys.localStorage.getItem(key);
    return LZString.decompressFromBase64(data);
};

StorageManager.webStorageBackupExists = function(savefileId) {
    var key = this.webStorageKey(savefileId) + "bak";
    return !!cc.sys.localStorage.getItem(key);
};

StorageManager.webStorageExists = function(savefileId) {
    var key = this.webStorageKey(savefileId);
    return !!cc.sys.localStorage.getItem(key);
};

StorageManager.removeWebStorage = function(savefileId) {
    var key = this.webStorageKey(savefileId);
    cc.sys.localStorage.removeItem(key);
};

// StorageManager.localFileDirectoryPath = function() {
//     var path = window.location.pathname.replace(/(\/www|)\/[^\/]*$/, '/save/');
//     if (path.match(/^\/([A-Z]\:)/)) {
//         path = path.slice(1);
//     }
//     return decodeURIComponent(path);
// };

// StorageManager.localFilePath = function(savefileId) {
//     var name;
//     if (savefileId < 0) {
//         name = 'config.rpgsave';
//     } else if (savefileId === 0) {
//         name = 'global.rpgsave';
//     } else {
//         name = 'file%1.rpgsave'.format(savefileId);
//     }
//     return this.localFileDirectoryPath() + name;
// };

StorageManager.webStorageKey = function(savefileId) {
    if (savefileId < 0) {
        return 'UserConfig';
    } else if (savefileId === 0) {
        return 'UserGlobal';
    } else {
        return 'UserFile%1'.format(savefileId);
    }
};