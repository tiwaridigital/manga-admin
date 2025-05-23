import S3 from 'aws-s3'

const upload = (file) => {
  const config = {
    bucketName: 'man-pac',
    // dirName: 'photos', /* optional */
    // region: 'eu-west-1',
    region: 'auto',
    accessKeyId: 'd07cfd883589b84458bf52b51768ac0d',
    secretAccessKey:
      'bddeb3ce1706701edf93976dffb30ef0423a695699929f46e034c5bb8b3c6aec',
    s3Url:
      'https://d15eb0203fe48da452c69098092ecf46.r2.cloudflarestorage.com/man-pac',
  }

  const S3Client = new S3(config)
  /*  Notice that if you don't provide a dirName, the file will be automatically uploaded to the root of your bucket */

  /* This is optional */
  const newFileName = 'my-awesome-file'

  S3Client.uploadFile(file, newFileName)
    .then((data) => console.log('data', data))
    .catch((err) => console.error('error s3', err))

  /**
   * {
   *   Response: {
   *     bucket: "your-bucket-name",
   *     key: "photos/image.jpg",
   *     location: "https://your-bucket.s3.amazonaws.com/photos/image.jpg"
   *   }
   * }
   */
}

export default upload
