module.exports = {
  output: {
    filename: "scripts/[name].[hash:5].bundles.js", // 线上环境md5
    publicPath: "/" // 上线的cdn
  }
}
