var MAX_HAND = 5;

var PLAYER_POSITION_DOWN = 0;
var PLAYER_POSITION_UP = 1;

var PLAYER_TYPE_PLAYER = 0;
var PLAYER_TYPE_AI = 1;


var CharacterModel = Backbone.Model.extend({
    defaults:function(){
        return {
            position: PLAYER_POSITION_DOWN,
            type: PLAYER_TYPE_PLAYER,
            level : 1,

            hp: 100,
            maxHp: 100,
            hpGeneration: 0,
            
            mana: 100,
            maxMana: 100,
            manaGeneration: 1,

            attack: 10,
            defense: 0,
            

            dexterity: 0, // dodge attack
            reflection: 10, // card speed
            stamina: 3, //card number + card appear duration

            
            earthResist: 0,
            waterResist: 0,
            airResist: 0,
            fireResist: 0,
            lightResist: 0,
            darkResist: 0,
            
            deck: [],
            discardDeck: [],
            outCards: [],
            hands: [],
            
            equipments: [],
            status:[]
            
        }
    },
    initialize:function(){

    },
    getMaxHpOfLevel:function(l){

    },
    canTake:function(model){
        if ( model instanceof PokerCardModel )
            return this.get("hands").length < MAX_HAND;
        else return false;
    },
    sortHand:function(){
        var cards = this.get("hands");
        var sortedCards = _.sortBy(cards, function(cardModel){
            var number = cardModel.get("number");
            return (100-number)*100+cardModel.get("suit");
        },this );
        this.set("hands",sortedCards);

        this.trigger("change:hands",this);
    },
    addHand:function(cardModel){
        cardModel._owned = true
        var cards = this.get("hands");
        cards.push(cardModel);
        this.sortHand();
        this.onGetCard(cardModel);
        fightModel.getOpponentPlayer(this).onOpponentGetCard(cardModel);
    },
    onGetCard:function(cardModel){

    },
    onOpponentGetCard:function(cardModel){

    },
    drawCard:function(){

    },
    discardCard:function(cardModel){
        if ( cardModel instanceof PokerCardModel ) {
            this.set("outCards", _.reject(this.get("outCards"),function(c){
                return c === cardModel
            },this));
            this.set("hands", _.reject(this.get("hands"),function(c){
                return c === cardModel
            },this));
            this.get("discardDeck").push(new PokerCardModel({
                number: cardModel.get("number"),
                suit: cardModel.get("suit")
            }))
        }
    }
})
