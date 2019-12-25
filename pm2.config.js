module.exports = {
  apps: [
    {
      name: 'mock-server',
      script: './dist/src/bin/www.js',
      watch: true,
      env: {
        NODE_ENV: 'production'
      }
    }
  ]
}
