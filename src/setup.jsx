import { h, render } from "preact";
import { cfg } from "./config.js";

export function setup() {
    const { canvas, ctx } = create_canvas();
    if (cfg.always) {
        document.querySelector("video-js").appendChild(canvas);
    } else {
        document.querySelector(".control-bar-mask").appendChild(canvas);
    }
    const { canvas: preview, ctx: preview_ctx } = create_canvas();
    preview.style.zIndex = 15;
    document.querySelector(".R18").appendChild(preview);

    create_panel();

    return { canvas, ctx, preview, preview_ctx };
}

function create_canvas() {
    const canvas = document.createElement("canvas");
    Object.assign(canvas, { width: 1000, height: 300 });
    Object.assign(canvas.style, {
        position: "absolute",
        bottom: 0,
        left: 0,
        width: "100%",
        zIndex: 5,
        "pointer-events": "none",
    });

    const ctx = canvas.getContext("2d");
    Object.assign(ctx, {
        fillStyle: "white",
        strokeStyle: "white",
        lineJoin: "round",
        lineCap: "round",
        lineWidth: 2,
    });

    return { canvas, ctx };
}

function create_panel() {
    const tabs = document.querySelector(".sub_top.ani-tabs");
    const contents = document.querySelector(".ani-tab-content");

    const tab = (
        <div id="cm-settings" class="ani-tabs__item">
            <a
                class="ani-tabs-link"
                href="#ani-tab-content-cm"
                onClick={(e) => {
                    document.querySelector(".ani-tabs-link.is-active").classList.remove("is-active");
                    e.target.classList.add("is-active");
                    document.querySelectorAll(".ani-tab-content__item").forEach((item) => {
                        item.style.display = "none";
                    });
                    document.querySelector("#ani-tab-content-cm").style.display = "block";
                    e.preventDefault();
                }}
            >
                彈幕山脈
            </a>
        </div>
    );

    const content = (
        <div class="ani-tab-content__item" id="ani-tab-content-cm" style="display: none">
            <div class="ani-setting-section">
                <h4 class="ani-setting-title">山脈設定</h4>
                <div class="ani-setting-item ani-flex">
                    <div class="ani-setting-label">
                        <span class="ani-setting-label__mian">持續顯示</span>
                    </div>
                    <div class="ani-setting-value ani-set-flex-right">
                        <div class="ani-checkbox">
                            <label class="ani-checkbox__label">
                                <input
                                    id="cm-always"
                                    type="checkbox"
                                    name="ani-checkbox"
                                    checked={cfg.always}
                                    onChange={(e) => {
                                        window.cm.always = e.target.checked;
                                    }}
                                ></input>
                                <div class="ani-checkbox__button"></div>
                            </label>
                        </div>
                    </div>
                </div>
                <div class="ani-setting-item ani-flex">
                    <div class="ani-setting-label">
                        <span class="ani-setting-label__mian">彩色顯示</span>
                    </div>
                    <div class="ani-setting-value ani-set-flex-right">
                        <div class="ani-checkbox">
                            <label class="ani-checkbox__label">
                                <input
                                    id="cm-colorful"
                                    type="checkbox"
                                    name="ani-checkbox"
                                    checked={cfg.colorful}
                                    onChange={(e) => {
                                        window.cm.colorful = e.target.checked;
                                    }}
                                ></input>
                                <div class="ani-checkbox__button"></div>
                            </label>
                        </div>
                    </div>
                </div>
                <div class="ani-setting-item ani-flex">
                    <div class="ani-setting-label">
                        <span class="ani-setting-label__mian">不透明度</span>
                        <span class="ani-setting-label__sub" id="cm-opacity-label">
                            {cfg.opacity * 100}%
                        </span>
                    </div>
                    <div class="ani-setting-value ani-set-flex-right">
                        <div class="ani-range" id="cm-opacity-range">
                            <input
                                type="range"
                                id="cm-opacity"
                                max="100"
                                min="10"
                                step="10"
                                value={cfg.opacity * 100}
                                onChange={(e) => {
                                    window.cm.opacity = parseInt(e.target.value) / 100;
                                    document.querySelector("#cm-opacity-label").innerText = e.target.value + "%";
                                }}
                            ></input>
                        </div>
                    </div>
                </div>
                <div class="ani-setting-item ani-flex">
                    <div class="ani-setting-label">
                        <span class="ani-setting-label__mian">熱度閥值</span>
                        <span class="ani-setting-label__sub" id="cm-threshold-label">
                            {cfg.threshold}
                        </span>
                    </div>
                    <div class="ani-setting-value ani-set-flex-right">
                        <div class="ani-range" id="cm-threshold-input">
                            <input
                                type="number"
                                id="cm-threshold"
                                max="1000"
                                min="0"
                                step="10"
                                value={cfg.threshold}
                                onChange={(e) => {
                                    window.cm.threshold = parseInt(e.target.value);
                                    document.querySelector("#cm-threshold-label").innerText = e.target.value;
                                }}
                            ></input>
                        </div>
                    </div>
                </div>
                <div class="ani-setting-item ani-flex">
                    <div class="ani-setting-label">
                        <span class="ani-setting-label__mian">切片大小</span>
                        <span class="ani-setting-label__sub" id="cm-segments-label">
                            {cfg.segments}
                        </span>
                    </div>
                    <div class="ani-setting-value ani-set-flex-right">
                        <div class="ani-range" id="cm-segments-input">
                            <input
                                type="number"
                                id="cm-segments"
                                max="1000"
                                min="0"
                                step="10"
                                value={cfg.segments}
                                onChange={(e) => {
                                    window.cm.segments = parseInt(e.target.value);
                                    document.querySelector("#cm-segments-label").innerText = e.target.value;
                                }}
                            ></input>
                        </div>
                    </div>
                </div>
            </div>
            <style>
                #ani-tab-content-cm input[type="number"] {"{"}
                border: none; color: #54c3e0; font-size: 2rem; text-align: right; {"}"}
            </style>
        </div>
    );

    render(tab, tabs.appendChild(document.createElement("div")));
    render(content, contents.appendChild(document.createElement("div")));
}
