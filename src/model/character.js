var DIRECTION_UP = 0
var DIRECTION_RIGHT = 1
var DIRECTION_DOWN = 2
var DIRECTION_LEFT = 3

var MAX_HAND = 5;

var PLAYER_POSITION_DOWN = 0;
var PLAYER_POSITION_UP = 1;

var PLAYER_TYPE_PLAYER = 0;
var PLAYER_TYPE_AI = 1;

var STANDARD_DECK = [
    {suit:SUIT_NUMBER_EARTH, number:7},{suit:SUIT_NUMBER_EARTH, number:8},{suit:SUIT_NUMBER_EARTH, number:9},{suit:SUIT_NUMBER_EARTH, number:10},{suit:SUIT_NUMBER_EARTH, number:11},{suit:SUIT_NUMBER_EARTH, number:12},{suit:SUIT_NUMBER_EARTH, number:13},
    {suit:SUIT_NUMBER_WATER, number:7},{suit:SUIT_NUMBER_WATER, number:8},{suit:SUIT_NUMBER_WATER, number:9},{suit:SUIT_NUMBER_WATER, number:10},{suit:SUIT_NUMBER_WATER, number:11},{suit:SUIT_NUMBER_WATER, number:12},{suit:SUIT_NUMBER_WATER, number:13},
    {suit:SUIT_NUMBER_AIR, number:7},{suit:SUIT_NUMBER_AIR, number:8},{suit:SUIT_NUMBER_AIR, number:9},{suit:SUIT_NUMBER_AIR, number:10},{suit:SUIT_NUMBER_AIR, number:11},{suit:SUIT_NUMBER_AIR, number:12},{suit:SUIT_NUMBER_AIR, number:13},
    {suit:SUIT_NUMBER_FIRE, number:7},{suit:SUIT_NUMBER_FIRE, number:8},{suit:SUIT_NUMBER_FIRE, number:9},{suit:SUIT_NUMBER_FIRE, number:10},{suit:SUIT_NUMBER_FIRE, number:11},{suit:SUIT_NUMBER_FIRE, number:12},{suit:SUIT_NUMBER_FIRE, number:13}
]

var CharacterModel = Backbone.Model.extend({
    defaults:function(){
        return {
            position: PLAYER_POSITION_DOWN,
            direction: DIRECTION_UP,
            type: PLAYER_TYPE_PLAYER,
            level : 1,

            hp: 100,
            maxHp: 100,
            hpGeneration: 0,
            
            mana: 100,
            maxMana: 100,
            manaGeneration: 1, //per second

            attack: 10,
            defense: 0,
            

            dexterity: 0, // dodge attack
            reflection: 10, // card speed
            stamina: 10, //card number + card appear duration

            
            earthResist: 0,
            waterResist: 0,
            airResist: 0,
            fireResist: 0,
            lightResist: 0,
            darkResist: 0,
            
            deck: STANDARD_DECK,
            hands: [],
            
            equipments: [],
            status: [],
            magics: [],

            skills: []
        }
    },
    initialize:function(){
        this.__skillMap = {};
        this.__deck = _.map(this.get("deck"),function(entry){
            return new PokerCardModel(entry)
        });
        _.each( this.get("equipments"),function(equipmentModel){
            _.each(equipmentModel.getSkills(),function(skillModel){
                this.__skillMap[skillModel.get("requireHand")] = skillModel;
            },this)
            _.each(equipmentModel.get("provideCards"),function(cardEntry){
                this.__deck.push(new PokerCardModel(cardEntry))
            },this);
        },this)

        this.__deck = _.shuffle(this.__deck);
        this.__discardDeck = [];

        this.__outCards = [];

        this.__performingSkill = false;
        this.__skillWaitingMana = null;

        this.__currentCardPattern = null;
        this.on("change:mana",this.onManaChange,this)
    },
    maintain:function(){
        this.set("mana",Math.min(this.get("mana")+this.get("manaGeneration"), this.get("maxMana")))
    },
    getMaxHpOfLevel:function(l){

    },
    getPattern:function(){
        if ( !this.__currentCardPattern ) {
            this.__currentCardPattern = new PatternModel(); //TODO sample from poll effect by stamina
        }
        return this.__currentCardPattern;
    },
    getGenerateCardStrategy:function(){
        var pattern = this.getPattern();
        var strategy = pattern.getCardStrategy();
        if ( !strategy ) {
            this.__currentCardPattern = null;
            return {
                type: "delay",
                time: 4  //TODO effect by stamina
            }
        }
        if ( strategy.type === "delay" ) {
            return strategy;
        } else {
            var cardModel = this.drawCard();

            if ( !cardModel ) return {
                type: "delay",
                time: 2
            }
            if ( strategy.type === "card" ) {
                strategy.card = cardModel;
                strategy.speed = NATURE_SPEED; //TODO effect by reflection
                return strategy;
            }
        }
    },
    drawCard:function(){
        if ( !this.__deck.length ) {
            this.__deck = _.shuffle(this.__discardDeck);
            this.__discardDeck = [];
        }
        var cardModel = this.__deck.pop();
        if ( cardModel ) {
            this.__outCards.push(cardModel)
        }
        return cardModel;
    },
    canTake:function(model){
        if ( model instanceof PokerCardModel ) {
            return !this.__performingSkill && this.get("hands").length < MAX_HAND;
        } else return false;
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
        this.__outCards = _.reject(this.__outCards,function(c){
            return c === cardModel
        },this);
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
    discardCard:function(cardModel){
        if ( cardModel instanceof PokerCardModel ) {
            if ( cardModel.get("owner") !== this.get("position") ) {
                cc.error("not card owned");
            }
            this.__outCards = _.reject(this.__outCards,function(c){
                return c === cardModel
            },this);
            this.set("hands", _.reject(this.get("hands"),function(c){
                return c === cardModel
            },this));
            this.__discardDeck.push(new PokerCardModel({
                number: cardModel.get("number"),
                suit: cardModel.get("suit")
            }))
        }
    },
    checkFullHand:function(){
        var hands = this.get("hands");
        if ( hands.length >= MAX_HAND ) {
            this.trigger("hand-full", this)
            var feature = getHandFeature(this.get("hands"));
            var skillModel = findValidSkill(this.__skillMap, feature.typeId )
            if ( skillModel && this.canPerformSkill(skillModel, feature) ) {
                this.tryPerformSkill(skillModel, feature);
            }
        }
    },


    calculateWantAndHate:function(){
        var hands = this.get("hands");
        this.wantNumber = [];
        this.reallyWantNumber = [];
        this.wantSuit = [];
        this.hateNumber = [];
        this.hateSuit = [];
        if ( hands.length === 2 ) {
            var number0 = hands[0].get("number");
            var number1 = hands[1].get("number");
            var suit0 = hands[0].get("suit");
            var suit1 = hands[1].get("suit");
            if ( number0 === number1 ) {
                this.wantNumber.push(number0)
            } else if ( number0 - number1 <= 4) {//顺子潜力
                for ( var i = number0 - 4; i <= number1 + 4; i++) {
                    this.wantNumber.push(i)
                }
                this.reallyWantNumber.push(number0)
                this.reallyWantNumber.push(number1)
                this.hateNumber = _.union(this.hateNumber, _.without(ALL_NUMBERS, this.wantNumber ))
            } else { //散牌
                this.wantNumber.push(number0)
                this.wantNumber.push(number1)
            }
            if ( suit0 === suit1 && suit0 !== SUIT_NUMBER_BLANK ) {
                this.wantSuit.push(suit0);
            }
        } else if ( hands.length === 3 ) {
            var number0 = hands[0].get("number");
            var number1 = hands[1].get("number");
            var number2 = hands[2].get("number");
            var suit0 = hands[0].get("suit");
            var suit1 = hands[1].get("suit");
            var suit2 = hands[2].get("suit");
            if ( number0 === number1 && number0 === number2) { //三张
                this.wantNumber.push(number0)
            } else if ( number0 === number1 || number1 === number2) { //有一对
                this.wantNumber.push(number0)
                this.wantNumber.push(number2)
                if ( number0 === number1 )
                    this.reallyWantNumber.push(number0)
                else
                    this.reallyWantNumber.push(number2)
                this.hateNumber = _.without(ALL_NUMBERS, this.wantNumber )
            } else if ( number0 - number2 <= 4) {//顺子潜力
                for ( var i = number0 - 4; i <= number2 + 4; i++) {
                    if ( i !== number0 && i !== number1 && i !== number2 )
                        this.wantNumber.push(i)
                }
                this.reallyWantNumber.push(number0)
                this.reallyWantNumber.push(number1)
                this.reallyWantNumber.push(number2)
                this.hateNumber = _.without(ALL_NUMBERS, this.wantNumber)
            } else { //散牌
                this.wantNumber.push(number0)
                this.wantNumber.push(number1)
                this.wantNumber.push(number2)
                this.hateNumber = _.without(ALL_NUMBERS, this.wantNumber)
            }
            if ( suit0 === suit1 && suit0 === suit2 && suit0 !== SUIT_NUMBER_BLANK) {
                this.wantSuit.push(suit0);
                this.hateSuit = _.without(ALL_SUIT_NUMBERS, suit0)
            }
        } else if ( hands.length === 4 ) {
            var number0 = hands[0].get("number");
            var number1 = hands[1].get("number");
            var number2 = hands[2].get("number");
            var number3 = hands[3].get("number");
            var suit0 = hands[0].get("suit");
            var suit1 = hands[1].get("suit");
            var suit2 = hands[2].get("suit");
            var suit3 = hands[3].get("suit");
            if ( number0 === number1 && number0 === number2 && number0 === number3) { //四条
                this.wantNumber.push(number0)
            } else if ( ( number0 === number1 && number0 === number2 )||
                ( number1 === number2 && number1 === number3 ) ||
                ( number0 === number1 && number2 === number3 ) ) { //三条或两对
                this.wantNumber.push(number0)
                this.wantNumber.push(number3)
                if ( number0 === number1 && number0 === number2 ) {
                    this.reallyWantNumber.push(number0)
                } else if ( number1 === number2 && number1 === number3 ) {
                    this.reallyWantNumber.push(number1)
                }
                this.hateNumber = _.without(ALL_NUMBERS, this.wantNumber )
            } else if (  number0 === number1 ) { //一对
                this.wantNumber.push(number0)
                this.wantNumber.push(number2)
                this.wantNumber.push(number3)
                this.reallyWantNumber.push(number0)
                this.hateNumber = _.without(ALL_NUMBERS, this.wantNumber )
            } else if ( number1 === number2 ) { //一对
                this.wantNumber.push(number0)
                this.wantNumber.push(number1)
                this.wantNumber.push(number3)
                this.reallyWantNumber.push(number1)
                this.hateNumber = _.without(ALL_NUMBERS, this.wantNumber )
            } else if ( number2 === number3 ) { //一对
                this.wantNumber.push(number0)
                this.wantNumber.push(number1)
                this.wantNumber.push(number2)
                this.reallyWantNumber.push(number2)
                this.hateNumber = _.without(ALL_NUMBERS, this.wantNumber )
            } else if ( number0 - number3 <= 4) {//顺子潜力
                for ( var i = number0 - 4; i <= number3 + 4; i++) {
                    if ( i !== number0 && i !== number1 && i !== number2 && i !== number3)
                        this.wantNumber.push(i)
                }
                this.hateNumber = _.union(this.hateNumber, _.without(ALL_NUMBERS, this.wantNumber))
            } else { //散牌
                this.wantNumber.push(number0)
                this.wantNumber.push(number1)
                this.wantNumber.push(number2)
                this.wantNumber.push(number3)
                this.hateNumber = _.union(this.hateNumber, _.without(ALL_NUMBERS, this.wantNumber ))
            }
            if ( suit0 === suit1 && suit0 === suit2 && suit0 === suit3 && suit0 !== SUIT_NUMBER_BLANK) {
                this.wantSuit.push(suit0);
                this.hateSuit = _.without(ALL_SUIT_NUMBERS, suit0)
            }
        }
    },

    canPerformSkill:function(skillModel, feature){
        return true
    },

    onManaChange:function(){
        if ( this.__skillWaitingMana && this.__skillWaitingMana.get("manaCost") <= this.get("mana") ) {
            this.realPerformSkill(this.__skillWaitingMana);
            this.__skillWaitingMana = null;
        }
    },
    tryPerformSkill:function(skillModel, feature){
        this.trigger("before-perform-skill", skillModel, feature);
        this.__performingSkill = true;
        var cards = _.map(this.get("hands"),function(cardModel){return cardModel});
        _.each(cards,function(cardModel){
            cardModel.trigger("used")
        })
        if ( skillModel.get("manaCost") <= this.get("mana") ) {
            this.realPerformSkill(skillModel, feature);
        } else {
            this.__skillWaitingMana = skillModel;
            this.trigger("wait-mana", skillModel, feature);
        }
    },
    realPerformSkill:function(skillModel, feature){
        this.set("mana",this.get("mana") - skillModel.get("manaCost"));
        this.trigger("perform-skill", skillModel, feature);
    },

    afterPerformSkill:function(skillModel, feature){ //called by view
        this.__performingSkill = false;
    }
})
