export class Comment {
    text = "";
    userid = "";
    color = "";
    position = 0;
    size = 0;
    sn = 0;
    time = 0;

    constructor(data) {
        Object.assign(this, data);
    }
}

export class Point {
    x = 0;
    y = 0;

    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }
}
