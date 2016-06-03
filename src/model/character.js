var CharacterModel = Backbone.Model.extend({
    defaults:function(){
        return {
            hp: 100,
            maxHp: 100,

            exp: 0,
            requiredExp: 100,
            cunning: 0,
            constitute: 10,
            luck: 0
        }
    },
    initialize:function(){

    },
    getMaxHpOfLevel:function(l){

    }
})