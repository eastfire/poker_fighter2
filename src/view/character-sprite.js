var CharacterSprite = cc.Sprite.extend({
    ctor: function (options) {
        this._super();
        this.model = options.model;

        this.model.set("actionStatus","stand")
        this.render();
    },
    render:function(){
        this.setSpriteFrame(cc.spriteFrameCache.getSpriteFrame(this.model.get("type")+this.model.get("direction")+this.model.get("actionStatus")+"0.png"))
    }
});