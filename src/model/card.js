var SUIT_NUMBER_BLANK = 0;
var SUIT_NUMBER_EARTH = 1;
var SUIT_NUMBER_WATER = 2;
var SUIT_NUMBER_AIR = 3;
var SUIT_NUMBER_FIRE = 4;
var SUIT_NUMBER_LIGHT = 5;
var SUIT_NUMBER_DARK = 6;
var SUIT_NUMBER_SWORD = 7;
var SUIT_NUMBER_SHIELD = 8;
var SUIT_NUMBER_HP = 9;
var SUIT_NUMBER_MANA = 10;


var ALL_SUIT_NUMBERS = [SUIT_NUMBER_BLANK,SUIT_NUMBER_EARTH, SUIT_NUMBER_WATER, SUIT_NUMBER_AIR, SUIT_NUMBER_FIRE, SUIT_NUMBER_LIGHT, SUIT_NUMBER_DARK,
    SUIT_NUMBER_SWORD,SUIT_NUMBER_SHIELD,SUIT_NUMBER_HP,SUIT_NUMBER_MANA]
var SUIT_ARRAY = ["blank","earth","water","air","fire", "light","dark","sword","shield","hp","mana"];


var PokerCardModel = MovableModel.extend({
    defaults:function(){
        return _.extend(MovableModel.prototype.defaults.call(this),{
            side: "front",
            number : 1,
            suit: SUIT_NUMBER_BLANK,
            status:[],
            owner: PLAYER_POSITION_DOWN
        });
    },
    discard:function(){
        var playerModel = fightModel.getPlayerByPosition(this.get("owner"))
        playerModel.discardCard(this);
        MovableModel.prototype.discard.call(this);
    }
});
