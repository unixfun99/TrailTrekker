module.exports = {
  apps: [{
    name: 'trailtrekker',
    script: 'dist/index.js',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: '5000'
    },
    // Environment variables will be loaded from .env file
    // But you can also set them here directly:
    env_file: '.env'
  }]
};
