var SKILL_TYPE_MELEE = 1;
var SKILL_TYPE_MAGIC = 2;
var SKILL_TYPE_PROJECTILE = 3;
var SKILL_TYPE_DEFEND = 4;

var findValidSkill = function(skillListOrMap, handType){
    var skillMap = {};
    if ( typeof skillListOrMap === "object") {
        skillMap = skillListOrMap;
    } else {
        _.each(skillListOrMap, function (skillModel) {
            skillMap[skillModel.get("requireHand")] = skillModel;
        })
    }
    do {
        var skill = skillMap[handType]
        if ( skill ) {
            if ( skill.get("requireHand") === handType || skill.get("acceptHigherHand") ) {
                return skill;
            }
        }
        handType--;
    } while ( handType > 0 )
    return null;
}

var SkillModel = Backbone.Model.extend({
    defaults:function(){
        return {
            level: 1,
            name: "",
            type: SKILL_TYPE_MELEE,
            isNature: false,
            requireHand: HAND_HIGH_CARD,
            acceptHigherHand: true,
            manaCost: 1
        }
    },
    initialize:function(){
        this.set("manaCost",this.manaCostOfLevel())
    },
    manaCostOfLevel:function(level){
        level = level || this.get("level")
        return 10;
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
