
/**
 * プレイヤーができること
 * 
 * 手札を場に出す
 * デッキトップからカードを引く
 * 
 * ゲームマスターができること
 * 
 * プレイヤーにカードを渡す
 */

import { getCardId, CardImageManager } from './imageManager';

interface IComponent {
    x: number,
    y: number,
    width: number,
    height: number,
    draw(ctx: CanvasRenderingContext2D): void;
}

class Component implements IComponent {
    private _x: number;
    private _y: number;
    private _width: number;
    private _height: number;
    get x() {return this._x;}
    get y() {return this._y;}
    get width() {return this._width;}
    get height() {return this._height;}
    constructor(x: number, y: number, width: number, height: number) {
        this._x = x;
        this._y = y;
        this._width = width;
        this._height = height;
    }
    draw(ctx: CanvasRenderingContext2D): void {
        ctx.strokeRect(0, 0, this.width, this.height);
    }
}

class Hand extends Component {
    private cards: string[] = [];
    draw(ctx: CanvasRenderingContext2D): void {
        ctx.save();
        ctx.translate(this.x, this.y);
        const cim = CardImageManager.instance;
        const margin = this.width / this.cards.length;
        this.cards.forEach((cardId, index) => {
            const card = cim.getCardById(cardId);
            const w = card.width * (this.height / card.height);
            ctx.drawImage(card, margin * index, 0, w, this.height);
        });
        super.draw(ctx);
        ctx.restore();
    }
    append(card: string) {
        this.cards.push(card);
    }
    set hand(hand: string[]) {
        this.cards = hand.sort();
    }
}

class View {
    private width: number = 1280;
    private height: number = 640;
    private ctx: CanvasRenderingContext2D;
    private components: {[name: string]: IComponent} = {};
    constructor(ctx: CanvasRenderingContext2D) {
        this.ctx = ctx;
    }
    clear() {
        this.ctx.clearRect(0, 0, this.width, this.height);
    }
    draw() {
        this.clear();
        for (let component of Object.values(this.components)) {
            component.draw(this.ctx);
        }
    }
    append(name: string, component: IComponent) {
        this.components[name] = component;
    }
    set hand(hand: string[]) {
        (this.components['hand'] as Hand).hand = hand;
    }
}

/**
 * ゲーム設定
 */
class Config {
    // 初期手札枚数
    startingHandSize: number = 6;
    // 描画品質
    drawingQuality: number = 2;
}

const componentPosition = {
    'hand': {x: 0.05, y: 0.6, w: 0.9, h: 0.35}
}

class Game {
    private canvas: HTMLCanvasElement;
    private cards: string[] = [];
    private view: View;
    private hand: string[] = [];
    private conf: Config = new Config;
    constructor(canvas: HTMLCanvasElement) {
        const ratio = this.conf.drawingQuality;
        canvas.width = canvas.clientWidth * ratio;
        canvas.height = canvas.clientHeight * ratio;
        this.canvas = canvas;
        const ctx = this.canvas.getContext('2d') as CanvasRenderingContext2D;
        ctx.scale(ratio, ratio);
        this.view = new View(ctx);
    }
    async init(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.setUp();
        await CardImageManager.instance.init();
    }
    setUp() {
        ['c', 'd', 'h', 's'].forEach(s => {
            for (let n = 1; n <= 13; n++) {
                this.cards.push(getCardId(s, n));
            }
        });
        this.cards.push(getCardId('x', 1));
        for (let i = 0; i < this.conf.startingHandSize; i++) {
           this.hand.push(this.cards[Math.floor(this.cards.length * Math.random())]);
        }
        this.view.append('hand', new Hand(
            componentPosition['hand'].x * this.canvas.clientWidth,
            componentPosition['hand'].y * this.canvas.clientHeight,
            componentPosition['hand'].w * this.canvas.clientWidth,
            componentPosition['hand'].h * this.canvas.clientHeight
            ));
        this.view.hand = this.hand;
    }
    start() {
        this.view.draw();
    }
    update(command: string) {
        this.hand.push(this.cards[Math.floor(this.cards.length * Math.random())]);
        this.view.hand = this.hand;
        this.view.draw();
    }
}

export default Game;

// This file ends here.