module.exports = {
  apps : [{
    name: "ecommerce-coder",
    script: "./src/index.js",
    error_file: "./logs/.err.log",
    watch: false,
    instances: 2,
    ignore_watch: './logs/*'
  }]
}