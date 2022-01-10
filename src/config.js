const default_configs = {
    colorful: true,
    always: false,
    opacity: 0.3,
    wait: 1000,
    segments: 50,
    threshold: 300,
};

const configs = JSON.parse(
    localStorage.getItem("bahamut-anime-comment-mountains-configs") || JSON.stringify(default_configs),
);

export function get(key) {
    return configs[key];
}

export function set(key, value) {
    configs[key] = value;
    localStorage.setItem("bahamut-anime-comment-mountains-configs", JSON.stringify(configs));
}

export function reset() {
    localStorage.removeItem("bahamut-anime-comment-mountains-configs");
    for (let key in configs) {
        if (default_configs.hasOwnProperty(key)) {
            set(key, default_configs[key]);
        } else {
            delete configs[key];
        }
    }
}

export const cfg = {
    get colorful() {
        return get("colorful");
    },
    get always() {
        return get("always");
    },
    get opacity() {
        return get("opacity");
    },
    get wait() {
        return get("wait");
    },
    get segments() {
        return get("segments");
    },
    get threshold() {
        return get("threshold");
    },
    set colorful(value) {
        value = !!value;
        set("colorful", value);
    },
    set always(value) {
        value = !!value;
        set("always", value);
    },
    set opacity(value) {
        value = parseFloat(value) || 0.3;
        set("opacity", value);
    },
    set wait(value) {
        value = parseInt(value) || 1000;
        set("wait", value);
    },
    set segments(value) {
        value = parseInt(value) || 50;
        set("segments", value);
    },
    set threshold(value) {
        value = parseInt(value) || 300;
        set("threshold", value);
    },
};
