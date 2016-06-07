var MAX_HAND = 5;

var PLAYER_POSITION_DOWN = 0;
var PLAYER_POSITION_UP = 1;

var PLAYER_TYPE_PLAYER = 0;
var PLAYER_TYPE_AI = 1;

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
            status: [],
            magics: [],

            skills: []
        }
    },
    initialize:function(){
        this.__skillMap = {};
        _.each( this.get("equipments"),function(equipmentModel){
            _.each(equipmentModel.getSkills(),function(skillModel){
                this.__skillMap[skillModel.get("requireHand")] = skillModel;
            },this)
        },this)

        this.__performingSkill = false;
        this.__skillWaitingMana = null;

        this.on("change:mana",this.onManaChange,this)
    },
    getMaxHpOfLevel:function(l){

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
        this.set("outCards", _.reject(this.get("outCards"),function(c){
            return c === cardModel
        },this));
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
            if ( cardModel.get("owner") !== this.get("position") ) {
                cc.error("not card owned");
            }
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
    },
    checkFullHand:function(){
        var hands = this.get("hands");
        if ( hands.length >= MAX_HAND ) {
            this.trigger("hand-full", this)
            var feature = this.getFeature();
            var skillModel = findValidSkill(this.__skillMap, feature.typeId )
            if ( skillModel && this.canPerformSkill(skillModel) ) {
                this.tryPerformSkill(skillModel, feature.typeId);
            }
        }
    },

    is5ofAKind:function(cards) {
        if (cards[0].get("number") === cards[1].get("number") && cards[0].get("number") === cards[2].get("number") && cards[0].get("number") === cards[3].get("number") && cards[0].get("number") === cards[4].get("number") ) {
            return true;
        }
        return false;
    },
    isFlushStraight:function(cards){
        return this.isFlush(cards) && this.isStraight(cards);
    },
    is4ofAKind:function(cards){
        if (cards[0].get("number") === cards[1].get("number") && cards[0].get("number") === cards[2].get("number") && cards[0].get("number") === cards[3].get("number") ) {
            return cards[0];
        } else if ( cards[1].get("number") === cards[2].get("number") && cards[1].get("number") === cards[3].get("number") && cards[1].get("number") === cards[4].get("number") ) {
            return cards[1];
        }
        return false
    },
    isFullHouse:function(cards){
        if (cards[0].get("number") === cards[1].get("number") &&
            cards[0].get("number") === cards[2].get("number") &&
            cards[3].get("number") === cards[4].get("number") ) {
            return cards[0];
        } else if ( cards[0].get("number") === cards[1].get("number") &&
            cards[2].get("number") === cards[3].get("number") &&
            cards[3].get("number") === cards[4].get("number")) {
            return cards[2];
        }
        return false;
    },
    isStraight:function(cards){
        var v = _.map (cards, function(card){
            return card.get("number");
        },this).join("-");
        return STRAIGHT_MAP[v];
    },
    is3ofAKind:function(cards){
        if (cards[0].get("number") === cards[1].get("number") && cards[0].get("number") === cards[2].get("number") ) {
            return cards[0];
        } else if (cards[1].get("number") === cards[2].get("number") && cards[1].get("number") === cards[3].get("number") ) {
            return cards[1];
        } else if (cards[2].get("number") === cards[3].get("number") && cards[2].get("number") === cards[4].get("number") ) {
            return cards[2];
        }
        return false
    },
    isFlush:function(cards){
        var v = cards[0].get("suit");
        if ( v === SUIT_NUMBER_BLANK ) return false;
        for ( var i = 1; i < cards.length ; i++ ){
            if ( v != cards[i].get("suit") || cards[i].get("suit") === SUIT_NUMBER_BLANK)
                return false;
        }
        return true;
    },
    is2Pair: function(cards){
        if ( cards[0].get("number") === cards[1].get("number") && cards[2].get("number") === cards[3].get("number") ) {
            return cards[0];
        } else if ( cards[0].get("number") === cards[1].get("number") && cards[3].get("number") === cards[4].get("number") ) {
            return cards[0];
        } else if ( cards[1].get("number") === cards[2].get("number") && cards[3].get("number") === cards[4].get("number") ) {
            return cards[1];
        }
        return false;
    },
    isPair: function(cards){
        if ( cards[0].get("number") === cards[1].get("number") ){
            return cards[0];
        } else if ( cards[1].get("number") === cards[2].get("number") ){
            return cards[1];
        } else if ( cards[2].get("number") === cards[3].get("number") ){
            return cards[2];
        } else if ( cards[3].get("number") === cards[4].get("number") ){
            return cards[3];
        }
        return false;
    },
    getFeature: function(){
        var hands = this.get("hands");
        var cards = [];
        _.each(hands, function(cardModel){
            cards.push(cardModel);
        },this);
        for ( var i = this.get("hands").length; i < MAX_HAND; i++ ) {
            cards.push( new PokerCardModel({
                number : -i,
                suit: SUIT_NUMBER_BLANK
            }))
        }

        var power, type, theCard, rate,typeId;
        if ( this.is5ofAKind(cards) ) {
            power = 11000 + cards[0].get("number") * 20// + (19 - cards[0].get("suit"));
            type = "five-of-a-kind"
            rate = 100;
            typeId = HAND_5_OF_A_KIND;
            //cc.sys.localStorage.setItem("fiveOfAKindAppeared",true);
        } else if ( this.isFlushStraight(cards) ) {
            power = 10000 + cards[0].get("number") * 20// + (19 - cards[0].get("suit"));
            type = "straight-flush"
            rate = 50;
            typeId = HAND_STRAIGHT_FLUSH;
        } else if ( theCard = this.is4ofAKind(cards) ) {
            power = 9000 + theCard.get("number") * 20// + (19 - theCard.get("suit"));
            type = "four-of-a-kind";
            rate = 40;
            typeId = HAND_4_OF_A_KIND;
        } else if ( theCard = this.isFullHouse(cards) ) {
            power = 8000 + theCard.get("number") * 20// + (19 - theCard.get("suit"));
            type = "full-house";
            rate = 30;
            typeId = HAND_FULL_HOUSE;
        } else if ( this.isFlush(cards) ) {
            power = 7000 + cards[0].get("number") * 20// + (19 - cards[0].get("suit"));
            type = "flush";
            rate = 20;
            typeId = HAND_FLUSH;
        } else if ( this.isStraight(cards) ) {
            power = 6000 + cards[0].get("number") * 20// + (19 - cards[0].get("suit"));
            type = "straight";
            rate = 15;
            typeId = HAND_STRAIGHT;
        } else if ( theCard = this.is3ofAKind(cards) ) {
            power = 5000 + theCard.get("number") * 20// + (19 -theCard.get("suit"));
            type = "three-of-a-kind";
            rate = 10;
            typeId = HAND_3_OF_A_KIND;
        } else if ( theCard = this.is2Pair(cards) ) {
            power = 4000 + theCard.get("number") * 20// + (19 -theCard.get("suit"));
            type = "two-pair";
            rate = 4;
            typeId = HAND_2_PAIRS;
        } else if ( theCard = this.isPair(cards) ) {
            power = 3000 + theCard.get("number") * 20// + (19 -theCard.get("suit"));
            type = "one-pair";
            rate = 2;
            typeId = HAND_1_PAIR;
        } else if ( cards[0].get("number") > 0 ) {
            power = 2000 + cards[0].get("number") * 20// + (19 -cards[0].get("suit"));
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
            typeId: typeId
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

    canPerformSkill:function(skillModel){
        return true
    },

    onManaChange:function(){
        if ( this.__skillWaitingMana && this.__skillWaitingMana.get("manaCost") <= this.get("mana") ) {
            this.realPerformSkill(this.__skillWaitingMana);
            this.__skillWaitingMana = null;
        }
    },
    tryPerformSkill:function(skillModel, handTypeId){
        this.trigger("before-perform-skill", skillModel, handTypeId);
        this.__performingSkill = true;
        var cards = _.map(this.get("hands"),function(cardModel){return cardModel});
        _.each(cards,function(cardModel){
            cardModel.discard()
        })
        if ( skillModel.get("manaCost") <= this.get("mana") ) {
            this.realPerformSkill(skillModel);
        } else {
            this.__skillWaitingMana = skillModel;
            this.trigger("wait-mana", skillModel);
        }
    },
    realPerformSkill:function(skillModel){
        this.set("mana",this.get("mana") - skillModel.get("manaCost"));
        this.trigger("perform-skill", skillModel);
    },

    afterPerformSkill:function(skillModel){ //called by view
        this.__performingSkill = false;
    }
})
