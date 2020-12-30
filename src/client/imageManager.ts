const getCardId = (suit: string, n: number): string => {
    return n < 10 ? `${suit}0${n}` : `${suit}${n}`;
}

class CardImageManager {
    private constructor() {}
    private static _instance: CardImageManager;
    public static get instance(): CardImageManager {
        if (!this._instance) {
            this._instance = new CardImageManager;
        }
        return this._instance;
    }
    private imgs: { [key: string]: HTMLImageElement } = {};
    init(): Promise<void[]> {
        const p: Promise<void>[] = [];
        ['c', 'd', 's', 'h'].forEach(s => {
            for (let i = 1; i <= 13; i++) {
                p.push(this.loadImage(s, i));
            }
        });
        p.push(this.loadImage('x'));
        return Promise.all(p);
    }
    private loadImage(suit: string, n: number = 1): Promise<void> {
        return new Promise((resolve, reject) => {
            const img = new Image();
            const id = getCardId(suit, n);
            img.src = `/images/${id}.png`;
            img.addEventListener('load', () => {
                resolve();
            });
            this.imgs[id] = img;
        });
    }
    getCardById(id: string): HTMLImageElement {
        return this.imgs[id];
    }
    getCard(suit: string, n: number): HTMLImageElement {
        return this.getCardById(getCardId(suit, n));
    }
}

export { getCardId, CardImageManager };

// This file ends here.