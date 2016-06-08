var HAND_5_OF_A_KIND = 10
var HAND_STRAIGHT_FLUSH = 9
var HAND_4_OF_A_KIND = 8
var HAND_FULL_HOUSE = 7
var HAND_FLUSH = 6
var HAND_STRAIGHT = 5
var HAND_3_OF_A_KIND = 4
var HAND_2_PAIRS = 3
var HAND_1_PAIR = 2
var HAND_HIGH_CARD = 1
var HAND_NO_CARD = 0;

var ALL_NUMBERS = [2,3,4,5,6,7,8,9,10,11,12,13,14];

var STRAIGHT_MAP = {
    "14-3-2":true,
    "4-3-2":true,
    "5-4-3":true,
    "6-5-4":true,
    "7-6-5":true,
    "8-7-6":true,
    "9-8-7":true,
    "10-9-8":true,
    "11-10-9":true,
    "12-11-10":true,
    "13-12-11":true,
    "14-13-12":true,

    "14-4-3-2":true,
    "5-4-3-2":true,
    "6-5-4-3":true,
    "7-6-5-4":true,
    "8-7-6-5":true,
    "9-8-7-6":true,
    "10-9-8-7":true,
    "11-10-9-8":true,
    "12-11-10-9":true,
    "13-12-11-10":true,
    "14-13-12-11":true,

    "14-5-4-3-2":true,
    "6-5-4-3-2":true,
    "7-6-5-4-3":true,
    "8-7-6-5-4":true,
    "9-8-7-6-5":true,
    "10-9-8-7-6":true,
    "11-10-9-8-7":true,
    "12-11-10-9-8":true,
    "13-12-11-10-9":true,
    "14-13-12-11-10":true
};

var is5ofAKind = function(cards) {
    if (cards[0].number === cards[1].number && cards[0].number === cards[2].number && cards[0].number === cards[3].number && cards[0].number === cards[4].number ) {
        return true;
    }
    return false;
}
var isFlushStraight = function(cards){
    return this.isFlush(cards) && this.isStraight(cards);
}

var is4ofAKind = function(cards){
    if (cards[0].number === cards[1].number && cards[0].number === cards[2].number && cards[0].number === cards[3].number ) {
        return cards[0];
    } else if ( cards[1].number === cards[2].number && cards[1].number === cards[3].number && cards[1].number === cards[4].number ) {
        return cards[1];
    }
    return false
}

var isFullHouse = function(cards){
    if (cards[0].number === cards[1].number &&
        cards[0].number === cards[2].number &&
        cards[3].number === cards[4].number ) {
        return cards[0];
    } else if ( cards[0].number === cards[1].number &&
        cards[2].number === cards[3].number &&
        cards[3].number === cards[4].number) {
        return cards[2];
    }
    return false;
}

var isStraight = function(cards){
    var v = _.map (cards, function(card){
        return card.number;
    },this).join("-");
    return STRAIGHT_MAP[v];
}

var is3ofAKind = function(cards){
    if (cards[0].number === cards[1].number && cards[0].number === cards[2].number ) {
        return cards[0];
    } else if (cards[1].number === cards[2].number && cards[1].number === cards[3].number ) {
        return cards[1];
    } else if (cards[2].number === cards[3].number && cards[2].number === cards[4].number ) {
        return cards[2];
    }
    return false
}

var isFlush = function(cards){
    var v = cards[0].suit;
    if ( v === SUIT_NUMBER_BLANK ) return false;
    for ( var i = 1; i < cards.length ; i++ ){
        if ( v != cards[i].suit || cards[i].suit === SUIT_NUMBER_BLANK)
            return false;
    }
    return true;
}

var is2Pair = function(cards){
    if ( cards[0].number === cards[1].number && cards[2].number === cards[3].number ) {
        return cards[0];
    } else if ( cards[0].number === cards[1].number && cards[3].number === cards[4].number ) {
        return cards[0];
    } else if ( cards[1].number === cards[2].number && cards[3].number === cards[4].number ) {
        return cards[1];
    }
    return false;
}

var isPair = function(cards){
    if ( cards[0].number === cards[1].number ){
        return cards[0];
    } else if ( cards[1].number === cards[2].number ){
        return cards[1];
    } else if ( cards[2].number === cards[3].number ){
        return cards[2];
    } else if ( cards[3].number === cards[4].number ){
        return cards[3];
    }
    return false;
}

var getHandFeature = function(hands){
    var cards = [];
    _.each(hands, function(cardModel){
        if ( cardModel instanceof PokerCardModel ) {
            cards.push({
                suit: cardModel.get("suit"),
                number: cardModel.get("number")
            });
        } else if ( typeof cardModel === "object" ) {
            cards.push({
                suit: cardModel.suit,
                number: cardModel.number
            });
        }
    });
    for ( var i = hands.length; i < MAX_HAND; i++ ) {
        cards.push({
            number : -i,
            suit: SUIT_NUMBER_BLANK
        })
    }

    var power, type, theCard, rate,typeId;
    if ( is5ofAKind(cards) ) {
        power = 11000 + cards[0].number * 20// + (19 - cards[0].get("suit"));
        type = "five-of-a-kind"
        rate = 100;
        typeId = HAND_5_OF_A_KIND;
        //cc.sys.localStorage.setItem("fiveOfAKindAppeared",true);
    } else if ( isFlushStraight(cards) ) {
        power = 10000 + cards[0].number * 20// + (19 - cards[0].get("suit"));
        type = "straight-flush"
        rate = 50;
        typeId = HAND_STRAIGHT_FLUSH;
    } else if ( theCard = is4ofAKind(cards) ) {
        power = 9000 + theCard.number * 20// + (19 - theCard.get("suit"));
        type = "four-of-a-kind";
        rate = 40;
        typeId = HAND_4_OF_A_KIND;
    } else if ( theCard = isFullHouse(cards) ) {
        power = 8000 + theCard.number * 20// + (19 - theCard.get("suit"));
        type = "full-house";
        rate = 30;
        typeId = HAND_FULL_HOUSE;
    } else if ( isFlush(cards) ) {
        power = 7000 + cards[0].number * 20// + (19 - cards[0].get("suit"));
        type = "flush";
        rate = 20;
        typeId = HAND_FLUSH;
    } else if ( isStraight(cards) ) {
        power = 6000 + cards[0].number * 20// + (19 - cards[0].get("suit"));
        type = "straight";
        rate = 15;
        typeId = HAND_STRAIGHT;
    } else if ( theCard = is3ofAKind(cards) ) {
        power = 5000 + theCard.number * 20// + (19 -theCard.get("suit"));
        type = "three-of-a-kind";
        rate = 10;
        typeId = HAND_3_OF_A_KIND;
    } else if ( theCard = is2Pair(cards) ) {
        power = 4000 + theCard.number * 20// + (19 -theCard.get("suit"));
        type = "two-pair";
        rate = 4;
        typeId = HAND_2_PAIRS;
    } else if ( theCard = isPair(cards) ) {
        power = 3000 + theCard.number * 20// + (19 -theCard.get("suit"));
        type = "one-pair";
        rate = 2;
        typeId = HAND_1_PAIR;
    } else if ( cards[0].number > 0 ) {
        power = 2000 + cards[0].number * 20// + (19 -cards[0].get("suit"));
        type = "high-card";
        rate = 1;
        typeId = HAND_HIGH_CARD;
    } else {
        power = 0;
        type = "no-card";
        rate = 0;
        typeId = HAND_NO_CARD;
    }
    return {
        power: power,
        type: type,
        rate: rate,
        typeId: typeId,
        cards: cards
    }
}