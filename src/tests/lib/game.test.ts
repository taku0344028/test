import Game, { TrumpDeck } from '#/lib/game';

describe('game', () => {
    test('トランプの山札を扱う', () => {
        const deck = new TrumpDeck;
        deck.shuffle();
        const cards = deck.draw(5, 1);
        expect(cards.length).toBe(5);
        expect(deck.draw(50).length).toBe(48);
    });
});
