import { retry, log, sleep } from "./utils.js";
import { setup } from "./setup.jsx";
import { Comment, Point } from "./types.js";
import { cfg, reset } from "./config.js";

let canvas, ctx;
let comments = [];
let video_duration = null;

(async function () {
    await sleep(cfg.wait);
    observe_video_src();
    let elms = setup();
    canvas = elms.canvas;
    ctx = elms.ctx;
    comments = await get_comments();
    paint();
    elms.preview_ctx.drawImage(canvas, 0, 0);
    set_global_hook();
})();

function paint() {
    const { max, heights } = calc_heights();
    const points = calc_points(heights);
    set_color(max);
    set_opacity();
    draw_mountains(points);
}

/**
 * @param {boolean} ignore
 * @returns {Promise<Comment[]>}
 */
async function get_comments(ignore = false) {
    const data = await retry(() =>
        fetch("https://ani.gamer.com.tw/ajax/danmuGet.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: `sn=${location.search.match(/\d+/)[0]}`,
        }).then((res) => res.json()),
    );
    const comments = data.map((x) => new Comment(x));
    log("Comments", comments);

    if (ignore) {
        const ignores = await retry(() =>
            fetch("https://ani.gamer.com.tw/ajax/keywordGet.php")
                .then((res) => res.json())
                .then((list) => list.map((x) => x.keyword)),
        );
        return comments.filter((x) => !ignores.some((y) => x.text.includes(y)));
    }

    return comments;
}

/**=
 * @returns {{max: number, heights: number[]}}
 */
function calc_heights() {
    comments = comments.sort((a, b) => a.time - b.time);
    const width = (video_duration || comments[comments.length - 1].time) / cfg.segments;
    log("Width", width);

    const heights = new Array(cfg.segments).fill(0);
    let idx = 0;
    for (let i = 0; i < comments.length; i++) {
        while (comments[i].time > (idx + 1) * width + 0.1) {
            idx++;
        }
        heights[idx]++;
    }
    heights.splice(cfg.segments, heights.length - cfg.segments);
    log("Heights", heights);

    const max = Math.max(...heights);
    log("Max", max);
    const normalized = heights.map((x) => x / max);
    log("Normalized", normalized);

    return { max, heights: normalized };
}

/**
 * @param {number[]} heights
 * @param {HTMLCanvasElement} canvas
 * @returns {Point[]}
 */
function calc_points(heights) {
    const points = [];

    for (let i = 0; i < heights.length; i++) {
        points.push(new Point((canvas.width / heights.length) * (i + 0.5), canvas.height * 0.5 * (2 - heights[i])));
    }

    return points;
}

/**
 * @param {number} max
 */
function set_color(max) {
    const offset = max - cfg.threshold < 50 ? max - cfg.threshold : 50;
    log("Color Offset", offset);
    if (cfg.colorful) {
        const grd = ctx.createLinearGradient(0, canvas.height * 0.5 + offset, 0, canvas.height);
        grd.addColorStop(0, "#BF616A");
        grd.addColorStop(0.4, "#EBCB8B");
        grd.addColorStop(0.5, "#EBCB8B");
        grd.addColorStop(1, "#A3BE8C");
        ctx.fillStyle = grd;
    } else {
        ctx.fillStyle = "white";
    }
}

function set_opacity() {
    if (cfg.opacity) {
        ctx.globalAlpha = cfg.opacity;
    } else {
        ctx.globalAlpha = 0.3;
    }
}

/**
 * @param {HTMLCanvasElement} canvas
 * @param {CanvasRenderingContext2D} ctx
 * @param {Point[]} points
 * @param {boolean} colorful
 */
function draw_mountains(points) {
    const paint_points = [new Point(0, canvas.height), ...points, new Point(canvas.width, canvas.height)];

    const f = 0.3;
    const t = 0.6;

    let m = 0,
        dx1 = 0,
        dy1 = 0,
        dx2 = 0,
        dy2 = 0;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    ctx.moveTo(0, canvas.height);

    let prev_point = paint_points[0];

    for (let i = 0; i < paint_points.length; i++) {
        const curr_point = paint_points[i];
        const next_point = paint_points[i + 1];

        if (next_point) {
            m = (next_point.y - prev_point.y) / (next_point.x - prev_point.x);
            dx2 = (next_point.x - curr_point.x) * -f;
            dy2 = dx2 * m * t;
        } else {
            m = 0;
            dx2 = 0;
            dy2 = 0;
        }

        ctx.bezierCurveTo(prev_point.x - dx1, prev_point.y - dy1, curr_point.x + dx2, curr_point.y + dy2, curr_point.x, curr_point.y);

        dx1 = dx2;
        dy1 = dy2;
        prev_point = curr_point;
    }

    ctx.lineTo(canvas.width, canvas.height);
    ctx.closePath();

    ctx.fill();
}

function set_global_hook() {
    window.cm = {
        reset() {
            reset();
            paint();
        },
    };

    for (const key in cfg) {
        Object.defineProperty(window.cm, key, {
            get: () => cfg[key],
            set: (val) => {
                cfg[key] = val;
                if (key === "always") {
                    if (!!val) {
                        document.querySelector("video-js").appendChild(canvas);
                    } else {
                        document.querySelector(".control-bar-mask").appendChild(canvas);
                    }
                } else if (key === "wait") {
                    log("Wait", val);
                } else {
                    paint();
                }
            },
        });
    }
}

function observe_video_src() {
    const target = document.querySelector("video");
    const config = { attributes: true, attributeFilter: ["src"] };
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.attributeName === "src") {
                target.addEventListener("loadedmetadata", () => {
                    log("Real Video Duration", target.duration);
                    video_duration = target.duration * 10;
                    paint();
                });
            }
        });
    });
    observer.observe(target, config);
}
