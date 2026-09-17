module.exports = {
  apps: [
    {
      name: 'estudio-rf',
      script: 'npm',
      args: 'start',
      env: {
        PORT: 3002, // Cambiá este número si el 3002 ya está en uso
        NODE_ENV: 'production'
      }
    }
  ]
};
