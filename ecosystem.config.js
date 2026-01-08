// PM2 Ecosystem Configuration File
// Usage: pm2 start ecosystem.config.js

module.exports = {
  apps: [
    {
      name: 'maxpower-backend',
      script: './Backend/server.js',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
        PORT: 5000
      },
      error_file: './logs/pm2-error.log',
      out_file: './logs/pm2-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      autorestart: true,
      max_memory_restart: '1G',
      watch: false,
      ignore_watch: ['node_modules', 'logs'],
      // Restart app if it uses more than 500MB memory
      max_memory_restart: '500M',
      // Restart app if it crashes
      min_uptime: '10s',
      // Number of consecutive unstable restarts before stopping
      max_restarts: 10,
      // Wait time between restarts
      restart_delay: 4000
    }
  ]
};

