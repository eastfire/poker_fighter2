var CharacterModel = Backbone.Model.extend({
    defaults:function(){
        return {
            hp: 100,
            maxHp: 100,
            hpGeneration: 0,
            
            mana: 100,
            maxMana: 100,
            manaGeneration: 1,

            exp: 0,
            requiredExp: 100,
            
            attack: 10,
            defense: 0,
            
            strength: 0, // effect attack
            cunning: 0, //exp required
            constitute: 10, //maxhp
            luck: 0, //item drop
            dexterity: 0, // card speed + dodge attack
            stemina: 3, //card number + card appear duration
            
            earthResist: 0,
            waterResist: 0,
            airResist: 0,
            fireResist: 0,
            lightResist: 0,
            darkResist: 0,
            
            deck: [],
            discardDeck: [],
            outCards: [],
            
            equipments: [],
            status:[]
            
        }
    },
    initialize:function(){

    },
    getMaxHpOfLevel:function(l){

    }
})
