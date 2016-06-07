var EquipmentModel = Backbone.Model.extend({
    defaults:function(){
        return {
            level: 1,
            name: "",
            type:"",
            subtype:"",
            requirements:null,
            skillEntries:[]
        }
    },
    initialize:function(){
        this.__skillMap = {};
        _.each(this.get("skillEntries"),function(skillEntry){
            this.__skillMap[skillEntry.requireHand] = new SKILL_MODEL_MAP[skillEntry.name](skillEntry);
        },this)
    },
    getSkills:function(){
        return this.__skillMap;
    }
});

var EQUIPMENT_MODEL_MAP = {};

EQUIPMENT_MODEL_MAP.shortSword = EquipmentModel.extend({
    defaults:function(){
        return _.extend(EquipmentModel.prototype.defaults.call(this), {
            name: "shortSword",
            skillEntries:[{
                name: "light-attack",
                requireHand: HAND_2_PAIRS
            },{
                name: "heavy-attack",
                requireHand: HAND_FULL_HOUSE
            }]
        });
    }
})

EQUIPMENT_MODEL_MAP.smallShield = EquipmentModel.extend({
    defaults:function(){
        return _.extend(EquipmentModel.prototype.defaults.call(this), {
            name: "smallShield",
            skillEntries:[{
                name: "shield-up",
                requireHand: HAND_HIGH_CARD
            }]
        });
    }
})