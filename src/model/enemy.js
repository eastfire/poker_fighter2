var EXP_INFLATION_RATE = 10;
var SCORE_INFLATION_RATE = 20;

var EnemyModel = CharacterModel.extend({
    defaults:function() {
        return _.extend(CharacterModel.prototype.defaults.call(this),{
            exp: 0,
            score: 0,
            type: PLAYER_TYPE_AI,
            position: PLAYER_POSITION_UP,
            direction: DIRECTION_DOWN
        });
    },
    initialize:function(){
        CharacterModel.prototype.initialize.call(this);
        this.set("exp",Math.round(this.expOfLevel()*EXP_INFLATION_RATE))
        this.set("score",Math.round(this.scoreOfLevel()*SCORE_INFLATION_RATE))
    },
    expOfLevel:function(level){
        level = level || this.get("level");
        return level*(level+1)/2
    },
    scoreOfLevel:function(level){
        level = level || this.get("level");
        return level*(level+1)/2
    }
})