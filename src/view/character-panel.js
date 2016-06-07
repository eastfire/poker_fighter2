var CharacterPanel = cc.Sprite.extend({
    ctor:function(options) {
        this._super();
        this.model = options.model;
    },
    onEnter:function(){
        this._super();
        this.initEvent();
        this.render();
    },
    onExit:function(){
        this.closeEvent();
        this._super();
    },
    initEvent:function(){
        this.model.on("change:hands",this.onHandChange, this);

    },
    closeEvent:function(){
        this.model.off("change:hands",this.onHandChange);
    },
    render:function(){

    },
    onHandChange:function(){
        var needCurve = true;
        var cards = this.model.get("hands");
        var index = 0;
        if ( cards.length == 0 ) {
            return;
        }
        var y = dimens.player1HandPosition.y;

        var estimateWidth = cards.length * dimens.card_size.width + (cards.length-1) * dimens.hand_line_card_padding;
        var x;
        var stepX;
        if ( estimateWidth < cc.winSize.width ) {
            x = ( cc.winSize.width - estimateWidth ) / 2 + dimens.card_size.width/2;
            stepX = dimens.card_size.width + dimens.hand_line_card_padding;
        } else {
            x = dimens.card_size.width/2;
            stepX = ( cc.winSize.width - dimens.card_size.width ) / (cards.length - 1);
        }

        var i = 0;
        var r = 400;
        _.each(cards,function(cardModel){
            var realX, realY, angle, cardAngle;
            if ( needCurve ) {
                angle = ( x - cc.winSize.width / 2 ) /r;
                realX = Math.sin(angle) * r + cc.winSize.width / 2;
                realY = Math.cos(angle) * r + y - r + 20;
                cardAngle = angle * 50;
                if ( this.model.get("position") == PLAYER_POSITION_UP ) {
                    realY = cc.winSize.height - realY;
                    realX = cc.winSize.width - realX;
                }
            } else {
                angle = 0;
                realX = x;
                realY = y;
            }
            if ( realY > cc.winSize.height/2 ) {
                cardAngle += 180;
            }
            var sprite = this.getParent().getChildByName(cardModel.cid);
            if ( sprite != null ) {
                if ( sprite.x != x || sprite.y != y) {
                    sprite.stopMove();
                    sprite.stopActionByTag(ACTION_TAG_TAKE_CARD);
                    sprite.contentSprite.stopActionByTag(ACTION_TAG_ROTATE);
                    sprite.runAction(new cc.MoveTo(times.card_sort, realX, realY)).setTag(ACTION_TAG_TAKE_CARD);
                    sprite.contentSprite.runAction(new cc.RotateTo(times.card_sort, cardAngle, cardAngle)).setTag(ACTION_TAG_ROTATE);
                    if ( sprite.isNewHand ) {
                        sprite.isNewHand = false;
                    }
                }
            }
            sprite.zIndex = i;
            i++;
            x += stepX;
        },this);

        this.model.checkFullHand();
    }
})