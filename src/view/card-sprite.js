

var MIN_SPEED = 100;
var MAX_SPEED = 400;

var PokerCardSprite = MovableSprite.extend({
    initView:function(){
        this.suitSprite = new cc.Sprite();
        this.suitSprite.attr({
            x: dimens.card_size.width/2,
            y: dimens.card_size.height/2
        });
        this.contentSprite.addChild(this.suitSprite, 0);
        
        this.numberSprite = new cc.Sprite();
        this.numberSprite.attr({
            x: dimens.card_number_position.x,
            y: dimens.card_number_position.y
        });
        this.contentSprite.addChild(this.numberSprite, 0);

        this.numberDownSprite = new cc.Sprite();
        this.numberDownSprite.attr({
            x: dimens.card_size.width - dimens.card_number_position.x,
            y: dimens.card_size.height - dimens.card_number_position.y,
            rotation: 180
        });
        this.contentSprite.addChild(this.numberDownSprite, 0);
    },
    initEvent:function(){
        this._super();
        this.model.on("used",this.onUsed,this)
    },
    onUsed:function(){
        this.runAction(cc.sequence(
            cc.spawn(
                cc.scaleTo(times.cardUsed, 0.2,0.2),
                cc.fadeOut(times.cardUsed)
            ),
            cc.callFunc(function(){
                this.model.discard();
            },this)
        ))
    }
})
