
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

interface Component {
    draw(ctx: CanvasRenderingContext2D): void;
}

class Hand implements Component {
    private cards: string[] = [];
    draw(ctx: CanvasRenderingContext2D): void {
        const cim = CardImageManager.instance;
        this.cards.forEach((card, index) => {
            ctx.drawImage(cim.getCardById(card), 40 * index, 0, 120, 160);
        });
    }
    append(card: string) {
        this.cards.push(card);
    }
    set hand(hand: string[]) {
        this.cards = hand;
    }
}

class View {
    private width: number = 2560;
    private height: number = 1280;
    private ctx: CanvasRenderingContext2D;
    private components: {[name: string]: {x: number, y: number, component: Component}} = {};
    constructor(ctx: CanvasRenderingContext2D) {
        this.ctx = ctx;
        this.ctx.scale(2, 2);
    }
    clear() {
        this.ctx.clearRect(0, 0, this.width, this.height);
    }
    draw() {
        this.clear();
        for (let component of Object.values(this.components)) {
            this.ctx.save();
            this.ctx.translate(component.x, component.y);
            component.component.draw(this.ctx);
            this.ctx.restore();
        }

        this.ctx.fillRect(10, 10, 10, 10);
        this.ctx.fillRect(1230, 0, 100, 100);
        this.ctx.fillRect(2510, 0, 100, 100);
        this.ctx.fillRect(0, 590, 100, 100);

    }
    append(name: string, component: Component) {
        this.components[name] = {
            x: 0,
            y: 0,
            component: component
        };
    }
    set hand(hand: string[]) {
        (this.components['hand'].component as Hand).hand = hand;
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
        this.view.append('hand', new Hand);
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