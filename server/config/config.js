let env = process.env.NODE_ENV || 'development';

if (env === 'development' || env === 'test') {
    const config = require('./config.json');
    const envConfig = config[env];

    Object.keys(envConfig).forEach((key) => {
        process.env[key] = envConfig[key]
    });
}

// When setting a variable to a property of another object, you must use the [bracket] notation.
// envConfig pulls off an array from the config JSON object based on what the current env is and what it matches up to in config.json.
// Then it's looped over with forEach resulting in
// process.env[PORT] = env.config[VALUE]
// process.env[MONGODB_URI] = env.config[VALUE]
// Etc... for each environment variable.
