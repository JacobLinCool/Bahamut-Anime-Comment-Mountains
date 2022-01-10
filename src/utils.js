/**
 * @param  {any[]} msg
 */
export function log(...msg) {
    if (msg.length >= 1) {
        console.log("%c[彈幕山脈]", "color: orange; font-weight: bold;", ...msg);
    } else {
        console.log();
    }
}

/**
 * @param {Function} func
 * @param {number} times
 * @returns {Promise<any>}
 */
export async function retry(func, times = 3) {
    for (let i = 0; i < times; i++) {
        try {
            return await func();
        } catch (err) {
            log("Retry", i + 1, func, err);
        }
    }
    log("Failed", func);
    throw new Error("Failed");
}

/**
 * @param {number} ms
 * @param {any} val
 * @returns {Promise<any>}
 */
export function sleep(ms, val) {
    return new Promise((resolve) => setTimeout(() => resolve(val), ms));
}
