const usage = {
    maps: 0,
    google: 0,
    linkedin: 0,
    instagram: 0,
    tiktok: 0,
};

export function increment(
    key: keyof typeof usage,
    amount = 1
) {
    usage[key] += amount;
}

export function getUsage() {
    return usage;
}

export function resetUsage() {
    Object.keys(usage).forEach(key => {
        usage[key as keyof typeof usage] = 0;
    });
}