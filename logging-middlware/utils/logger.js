const LOG_API_URL = 'http://20.244.56.144/evaluation-service/logs';

const AUTH_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiIyMnZlMWEwNWs1QHNyZXlhcy5hYy5pbiIsImV4cCI6MTc1MjgyNDEyMCwiaWF0IjoxNzUyODIzMjIwLCJpc3MiOiJBZmZvcmQgTWVkaWNhbCBUZWNobm9sb2dpZXMgUHJpdmF0ZSBMaW1pdGVkIiwianRpIjoiNzQxODEwNWUtYmQwMi00NmZmLWE2ODYtNzA1NmE4MDQxMzFkIiwibG9jYWxlIjoiZW4tSU4iLCJuYW1lIjoiYXNpbSBydXBhbmkiLCJzdWIiOiI3NzViZmYyZC1hMGNiLTQwYWYtODUzMy0wZjQyMWEzNWY1ZDcifSwiZW1haWwiOiIyMnZlMWEwNWs1QHNyZXlhcy5hYy5pbiIsIm5hbWUiOiJhc2ltIHJ1cGFuaSIsInJvbGxObyI6IjIydmUxYTA1azUiLCJhY2Nlc3NDb2RlIjoiTk5aREdxIiwiY2xpZW50SUQiOiI3NzViZmYyZC1hMGNiLTQwYWYtODUzMy0wZjQyMWEzNWY1ZDciLCJjbGllbnRTZWNyZXQiOiJTUWVDVlVES3ZlR2ZWZkNnIn0.RrvwcNkPcbzo4XyVbspTswV3O1wjZTYiowu1w5iF7wo'; // YOUR TOKEN GOES HERE

const log = async (stack, level, pkg, message) => {
    if (typeof stack !== 'string' || !stack.trim() ||
        typeof level !== 'string' || !level.trim() ||
        typeof pkg !== 'string' || !pkg.trim() ||
        typeof message !== 'string' || !message.trim()) {
        console.error('Log Error: One or more log parameters are missing or invalid.');
    }

    const truncatedMessage = message.length > 48 ? message.substring(0, 48) : message;

    const logPayload = {
        stack: stack.toLowerCase(),
        level: level.toLowerCase(),
        package: pkg.toLowerCase(),
        message: truncatedMessage 
    };

    try {
        const response = await fetch(LOG_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${AUTH_TOKEN}`
            },
            body: JSON.stringify(logPayload)
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`Failed to send log to external API. Status: ${response.status} ${response.statusText}. Response: ${errorText}`);
        }
    } catch (error) {
        console.error('Network error sending log to external API:', error.message);
    }
};

module.exports = {
    log
};
