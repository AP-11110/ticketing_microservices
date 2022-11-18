module.exports = {
    webpack: (config) => {
        config.watchOptions.poll = 300; // updates every 300ms, fixes the bug when pages won't reflect changes properly
        return config;
    }
};