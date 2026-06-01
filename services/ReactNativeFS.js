import RNBlobUtil from 'react-native-blob-util';

export default {
  async ReadFile(cb) {
    RNBlobUtil.fs.ls(RNBlobUtil.fs.dirs.DocumentDir)
      .then((files) => {
        console.log('GOT RESULT', files);

        // Find 'reduxPersist' folder
        let index = undefined;
        for (var i = 0; i < files.length; i++) {
          if (files[i] == 'reduxPersist') {
            index = i;
          }
        }

        const targetPath = `${RNBlobUtil.fs.dirs.DocumentDir}/${files[index]}`;
        return targetPath;
      })
      .then((folderPath) => {
        // Read inside reduxPersist folder
        return RNBlobUtil.fs.ls(folderPath)
          .then((innerFiles) => {
            const filePath = `${folderPath}/${innerFiles[0]}`;

            // Check if it's a file then read
            return RNBlobUtil.fs.stat(filePath)
              .then((stat) => {
                if (stat.type === 'file') {
                  return RNBlobUtil.fs.readFile(filePath, 'utf8')
                    .then((res) => {
                      var read = JSON.parse(res);
                      var parse = JSON.parse(read.audits);
                      console.log('Reading file...', parse);
                      cb(parse);
                    });
                }
              });
          });
      })
      .catch((err) => {
        console.log('Error:', err.message, err.code);
      });
  }
}