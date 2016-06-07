var MovableModel = Backbone.Model.extend({
    defaults:function(){
        return {
            x: 0,
            y: 0,
            direction: 0,
            speed: 0,
            crossX : {},
            crossY : {}
        }
    },
    initialize:function(){
    },
    registerDetectCrossX:function(x){
        this.get("crossX")[x] = true;
    },
    unregisterDetectCrossX:function(x){
        delete this.get("crossX")[x];
    },
    registerDetectCrossY:function(y){
        this.get("crossY")[y] = true;
    },
    unregisterDetectCrossY:function(y){
        delete this.get("crossY")[y];
    },
    discard:function(){
        this.destroy();
    },
    getInteractable:function(){
        return !this.alreadyTaken;
    }
});
