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

var SKILL_TYPE_MELEE = 1;
var SKILL_TYPE_MAGIC = 2;
var SKILL_TYPE_PROJECTILE = 3;
var SKILL_TYPE_DEFEND = 4;

var SkillModel = Backbone.Model.extend({
    defaults:function(){
        return {
            level: 1,
            name: "",
            type: SKILL_TYPE_MELEE,
            requireHand: HAND_HIGH_CARD,
            acceptHigherHand: true,
            cost: 1
        }
    },
    onUse:function(hands){
    }
});

var SKILL_MODEL_MAP = {};

SKILL_MODEL_MAP["light-attack"] = SkillModel.extend({
    defaults:function() {
        return _.extend(SkillModel.prototype.defaults.call(this),{
            name: "light-attack"
        });
    }
})

SKILL_MODEL_MAP["middle-attack"] = SkillModel.extend({
    defaults:function() {
        return _.extend(SkillModel.prototype.defaults.call(this),{
            name: "middle-attack"
        });
    }
})

SKILL_MODEL_MAP["heavy-attack"] = SkillModel.extend({
    defaults:function() {
        return _.extend(SkillModel.prototype.defaults.call(this),{
            name: "heavy-attack"
        });
    }
})

SKILL_MODEL_MAP["weapon-enchant-fire"] = SkillModel.extend({
    defaults:function() {
        return _.extend(SkillModel.prototype.defaults.call(this),{
            name: "weapon-enchant-fire"
        });
    }
})

SKILL_MODEL_MAP["shield-up"] = SkillModel.extend({
    defaults:function() {
        return _.extend(SkillModel.prototype.defaults.call(this),{
            name: "shield-up"
        });
    }
})
