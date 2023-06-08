module.exports = function() {
    return {
        environment: {
            environment: process.env.ELEVENTY_ENV || "dev",
            isProd: process.env.ELEVENTY_ENV == "prod",
            isDev: (process.env.ELEVENTY_ENV || "dev") == "dev"
        }
    };
}