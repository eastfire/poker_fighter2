var HeroModel = CharacterModel.extend({
    defaults:function() {
        return _.extend(CharacterModel.prototype.defaults.call(this),{
            exp: 0,
            requiredExp: 100,

            strength: 0, // effect attack
            cunning: 0, //exp required
            intelligent: 0, //maxMana
            constitute: 10, //maxhp
            luck: 0, //item drop

            bag:[] //背包
        });
    }
})