const log = async (stack, level, pkg, message) => {
    if (typeof stack !== 'string' || !stack.trim() ||
        typeof level !== 'string' || !level.trim() ||
        typeof pkg !== 'string' || !pkg.trim() ||
        typeof message !== 'string' || !message.trim()) {
        console.error('Log Error: One or more log parameters are missing or invalid.');
    }

    const truncatedMessage = message.length > 48 ? message.substring(0, 48) : message;

    const logString = `[${new Date().toISOString()}] [${stack.toLowerCase()}] [${level.toLowerCase()}] [${pkg.toLowerCase()}] ${truncatedMessage}`;

    if (level.toLowerCase() === 'error' || level.toLowerCase() === 'fatal') {
        console.error(logString);
    } else if (level.toLowerCase() === 'warn') {
        console.warn(logString);
    } else {
        console.log(logString);
    }

};

module.exports = {
    log
};