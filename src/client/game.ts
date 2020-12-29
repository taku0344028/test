
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

import { count } from "console";

class Card {
    show() { }
}

class Manager {

}

class Game {
    private canvas: HTMLCanvasElement | undefined = undefined;
    private ctx: CanvasRenderingContext2D | undefined = undefined;
    private cards: HTMLImageElement[] = [];
    init(canvas: HTMLCanvasElement): Promise<Game> {
        return new Promise((resolve, reject) => {
            this.canvas = canvas;
            this.ctx = this.canvas.getContext('2d') as CanvasRenderingContext2D;
            this.ctx.scale(2, 2);

            let counter = 0;
            ['c', 'd', 's', 'h'].forEach(s => {
                for (let i = 1; i <= 13; i++) {
                    const img = new Image();
                    if (i < 10) {
                        img.src = `/images/${s}0${i}.png`;
                    }
                    else {
                        img.src = `/images/${s}${i}.png`;
                    }
                    img.addEventListener('load', () => {
                        counter++;
                        if (counter == 52) {
                            console.log('completed.');
                            resolve(this);
                        }
                    });
                    this.cards.push(img);
                }
            });
        })
    }
    start() {
        for (let i = 0; i < 5; i++) {
            const r = Math.floor(this.cards.length * Math.random());
            console.log(r);
            
            const img = this.cards[r];
            this.ctx?.drawImage(img, 100 + 40 * i, 100);
        }
    }
}

export default Game;

// This file ends here.