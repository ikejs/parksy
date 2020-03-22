class AWSS3 {
  constructor() {
    this.config = {
      apiVersion: "2006-03-01",
      accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
      region: process.env.AWS_S3_REGION
    };
    
    this.s3 = new AWS.S3(this.config);
  }

  upload(filepath, name, options) {
    return new Promise((resolve, reject) => {
      if (fs.existsSync(filepath)) {
        let res = {
          filepath: filepath,
          data: []
        };
        let fileBinaryString = fs.readFileSync(filepath, null);
        let params = {
          Body: fileBinaryString,
          Bucket: process.env.AWS_S3_BUCKET_NAME,
          Key: name
        };

        if (
          typeof options !== "undefined" &&
          typeof options.resize !== "undefined" &&
          typeof options.resize.width === "number"
        ) {
          let width = options.resize.width;
          Sharp(filepath)
            .resize(width)
            .png()
            .toBuffer()
            .then(buffer => {
              params.Body = buffer;
              params.Key = `${params.Key}`;
              this.s3.putObject(params, (e, d) => {
                if (e) reject(e);
                d.name = params.Key;
                res.data.push(d);
                resolve(res);
              });
            })
            .catch(e => reject(e));
          } else {
            resolve(res);
          }
      } else {
        reject("File " + filepath + " does not exist");
      }
    });
  }
}

module.exports = new AWSS3();