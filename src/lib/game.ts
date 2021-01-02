
type Role = 'master' | 'player' | 'audience';
interface User {
    name: string;
    role: Role;
}

class Player implements User {
    protected _name: string;
    protected _hand: ICard[] = [];
    constructor(name: string) {
        this._name = name;
    }
    get name() {
        return this._name;
    }
    get role(): Role {
        return 'player';
    }
    playCard() {}
}

class Master extends Player {
    get role(): Role {
        return 'master';
    }
}

interface ICard {}

type Suit = 'clubs' | 'spades' | 'hearts' | 'diamonds' | 'joker';

class Trump implements ICard {
    suit: Suit;
    n: number;
    constructor(suit: Suit, n: number) {
        this.suit = suit;
        this.n = n;
    }
}

class CardDeck {
    protected deck: ICard[] = [];
    shuffle() {
        for (let i = this.deck.length; 1 < i; i--) {
            let k = Math.floor(Math.random() * i);
            const temp = this.deck[k];
            this.deck[k] = this.deck[i - 1];
            this.deck[i - 1] = temp;
        }
    }
    search() {}
    draw(n: number = 1, offset: number = 0): ICard[] {
        return this.deck.splice(offset, n);
    }
}

class TrumpDeck extends CardDeck {
    constructor(joker: number = 1) {
        super();
        ['clubs', 'hearts', 'diamonds', 'spades'].forEach(suit => {
            for (let n = 1; n <= 13; n++) {
                this.deck.push(new Trump(suit as Suit, n));
            }
        });
        for (let i = 0; i < joker; i++) {
            this.deck.push(new Trump('joker', 0));
        }
    }
}

class Game {
    private deck: Map<string, CardDeck> = new Map<string, CardDeck>();
    load() {}
    save() {}
    addPlayer() {}
    addCardDeck() {}
}

export default Game;
export { TrumpDeck };

// This file ends here.