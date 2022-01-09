(function () {
    setTimeout(() => add_trending(), 1000);

    async function add_trending(ignore = false) {
        let data = await retry(() =>
            fetch("https://ani.gamer.com.tw/ajax/danmuGet.php", {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                body: `sn=${location.search.match(/\d+/)[0]}`,
            }).then((res) => res.json()),
        );
        log("Comments", data);

        if (ignore) {
            const ignores = new Set(
                await retry(() =>
                    fetch("https://ani.gamer.com.tw/ajax/keywordGet.php")
                        .then((res) => res.json())
                        .then((list) => list.map((x) => x.keyword)),
                ),
            );
            data = data.filter((x) => !ignores.has(x.text));
        }

        paint(data, 50);
    }

    function paint(data, points) {
        const { canvas, ctx } = setup();
        const heights = gen_heights(data, points);
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.beginPath();
        ctx.moveTo(0, canvas.height);

        const f = 0.3;
        const t = 0.6;

        let m = 0,
            dx1 = 0,
            dy1 = 0,
            dx2 = 0,
            dy2 = 0;

        let prev_height = canvas.height;
        let prev_x = 0;

        for (let i = 0; i < heights.length; i++) {
            let curr_height = canvas.height * (1 - heights[i]),
                next_height = canvas.height * (1 - heights[i + 1]) || 0;
            if (next_height) {
                m = (next_height - prev_height) / (canvas.width / points);
                dx2 = (canvas.width / points) * -f;
                dy2 = dx2 * m * t;
            }

            ctx.bezierCurveTo(
                prev_x - dx1,
                prev_height - dy1,
                (canvas.width / points) * (i + 0.5) + dx2,
                curr_height + dy2,
                (canvas.width / points) * (i + 0.5),
                curr_height,
            );

            dx1 = dx2;
            dy1 = dy2;
            prev_height = curr_height;
            prev_x = (canvas.width / points) * (i + 0.5);
        }

        ctx.bezierCurveTo(
            prev_x - dx1,
            prev_height - dy1,
            (canvas.width / points) * (points + 0.5) + dx2,
            canvas.height + dy2,
            (canvas.width / points) * (points + 0.5),
            canvas.height,
        );

        ctx.lineTo(canvas.width, canvas.height);
        ctx.closePath();
        ctx.fill();
    }

    function gen_heights(data, points) {
        data = data.sort((a, b) => a.time - b.time);
        const width = data[data.length - 1].time / points;
        log("Width", width);

        const heights = new Array(points).fill(0);
        let idx = 0;
        for (let i = 0; i < data.length; i++) {
            while (data[i].time > (idx + 1) * width) {
                idx++;
            }
            heights[idx]++;
        }
        log("Heights", heights);

        const max = Math.max(...heights);
        log("Max", max);
        const normalized = heights.map((x) => x / max);
        log("Normalized", normalized);

        return normalized;
    }

    function setup() {
        const canvas = document.createElement("canvas");
        Object.assign(canvas, { width: 1000, height: 150 });
        Object.assign(canvas.style, {
            position: "absolute",
            bottom: 0,
            left: 0,
            width: "100%",
            zIndex: 15,
            opacity: 0.3,
        });

        const ctx = canvas.getContext("2d");
        Object.assign(ctx, {
            fillStyle: "white",
            strokeStyle: "white",
            lineJoin: "round",
            lineCap: "round",
            lineWidth: 2,
        });

        document.querySelector(".control-bar-mask").appendChild(canvas);

        return { canvas, ctx };
    }

    function log(...msg) {
        if (msg.length >= 1) {
            console.log("%c[彈幕山脈]", "color: orange; font-weight: bold;", ...msg);
        } else {
            console.log();
        }
    }

    async function retry(func, times = 3) {
        for (let i = 0; i < times; i++) {
            try {
                return await func();
            } catch (err) {
                log("Retry", func, i + 1, err);
            }
        }
        throw new Error("Failed");
    }
})();
