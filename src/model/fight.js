var FightModel = Backbone.Model.extend({
    defaults:function(){
        return {
            status:"game"
        }
    },
    getPlayerByPosition:function(position){
        if ( position === PLAYER_POSITION_DOWN ) {
            return this.get("p1");
        } return this.get("p2")
    },
    getOpponentPlayer:function(playerModel){
        if ( playerModel.get("position") === PLAYER_POSITION_DOWN ) {
            return this.get("p2");
        } return this.get("p1");
    }
});