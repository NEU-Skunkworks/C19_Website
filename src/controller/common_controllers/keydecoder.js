let decodedkey = (basestr) => {
  // create buffer from base64 string
  let binaryData = Buffer.from(basestr, 'base64')

  // decode buffer as utf8basestr
  let base64Dec = binaryData.toString('utf8')
  return base64Dec
}

module.exports={decodedkey}