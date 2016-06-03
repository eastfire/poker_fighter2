var HAND_5_OF_A_KIND = 10
var HAND_FLUSH_STRAIGHT = 9
var HAND_4_OF_A_KIND = 8
var HAND_FULL_HOUSE = 7
var HAND_FLUSH = 6
var HAND_STRAIGHT = 5
var HAND_3_OF_A_KIND = 4
var HAND_2_PAIRS = 3
var HAND_1_PAIR = 2
var HAND_HIGH_CARD = 1

var SkillModel = Backbone.Model.extend({
    defaults:function(){
        return {
            level: 1,
            requireHand: HAND_HIGH_CARD,
            acceptHigherHand: true,
            needMana: 1
        }
    },
    onUse:function(hands){
    }
});
