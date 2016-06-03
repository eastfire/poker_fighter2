var PokerCardModel = Backbone.Model.extend({
    defaults:function(){
        return {
            side: "front",
            number : 1,
            suit: 0
        }
    }
});