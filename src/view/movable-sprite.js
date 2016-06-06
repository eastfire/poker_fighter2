var ACTION_TAG_MOVE = 1000;
var ACTION_TAG_ROTATE = 1001;

var ACTION_TAG_TAKE_CARD = 1009;
var ACTION_TAG_FLIP = 1010;

var BORDER_PADDING = dimens.card_size.width/2+1;

var NATURE_SPEED = 180;

var MovableMoveToAction = cc.MoveTo.extend({
    update:function(dt){
        this._super(dt)
        if ( this.target instanceof MovableSprite) {
            this.target.checkCrossLine();
        }
    }
})

var MovableSprite = cc.Sprite.extend({
    ctor:function(options) {
        this._super();
        this.retain();
        this.model = options.model;

        this.setName(this.model.cid);

        this.contentSprite = new cc.Sprite();
        this.addChild(this.contentSprite);

        this.initView();

        this.model.registerDetectCrossX(-BORDER_PADDING);
        this.model.registerDetectCrossX(cc.winSize.width+BORDER_PADDING);
    },
    initView:function(){
    },
    moveByDirection:function(direct, speed){

    },
    moveToPosition:function(x,y,speed){
        if ( typeof x === "object") {
            speed = y;
            y = x.y;
            x = x.x;
        }
        if ( speed !== 0 && !speed) {
            speed = this.model.get("speed"); //keep old speed
        }
        if ( speed === 0 ) {
            this.stopMove();
            return;
        }
        this.model.set({
            destX: x,
            destY: y,
            speed: speed
        })

        var time = Math.sqrt((this.x - x) * (this.x - x) + (this.y - y) * (this.y - y)) / speed;

        var action = new MovableMoveToAction(time, x,y);
        action.setTag(ACTION_TAG_MOVE);
        this.__prevX = this.x;
        this.__prevY = this.y;

        this.runAction( action );
    },
    checkCrossLine:function(){
        var prevX = this.__prevX;
        var prevY = this.__prevY;
        var x = this.x;
        var y = this.y;

        var crossX = this.model.get("crossX");
        _.each( crossX ,function(value, lineX){
            if ( (x >= lineX && prevX < lineX) ||
                (x <= lineX && prevX > lineX) ) {
                this.model.set({
                    x: x,
                    y: y
                })
                this.model.trigger("crossX"+lineX, this.model)
            }
        },this )

        var crossY = this.model.get("crossY");
        _.each( crossY ,function(value, lineY){
            if ( (y >= lineY && prevY < lineY) ||
                (y <= lineY && prevY > lineY) ) {
                this.model.set({
                    x: x,
                    y: y
                })
                this.model.trigger("crossY"+lineY, this.model)
            }
        },this )

        this.__prevX = x;
        this.__prevY = y;
    },
    stopMove:function(){
        this.stopActionByTag(ACTION_TAG_MOVE)
    },
    onTouchRelease:function(){
        var player1Y = dimens.player1Y;
        var player2Y = dimens.player2Y;
        if ( this.y < player1Y ) {
            this.taken( fightModel.get("p1"));
            return;
        }
        if ( this.y > player2Y ) {
            this.taken(fightModel.get("p2"));
            return;
        }

        this.stopMove();

        var originSpeed = Math.max(MIN_SPEED, Math.sqrt( this.speedX*this.speedX + this.speedY * this.speedY ) );
        var speed = Math.min(originSpeed, MAX_SPEED);

        this.moveToPosition( this.speedX*10000, this.speedY*10000, speed );

    },
    canBeTouch:function(locationInNode){
        if ( this.model.alreadyTaken ) return false;
        if ( fightModel.get("p2").get("type") == PLAYER_TYPE_AI ) {
            if ( fightModel.get("p1").get("type") == PLAYER_TYPE_AI ) return false;
            if ( this.y > cc.winSize.height/2 + this.height/2 ) return false;
        } else if ( fightModel.get("p1").get("type") == PLAYER_TYPE_AI && this.y < cc.winSize.height/2 - this.height/2 ) return false;
        return true;
    },

    taken:function(player){
        if ( this.model.alreadyTaken )
            return;
        if ( player.canTake(this.model) ) {
            this.stopMove();
            //TODO stop rotate
            this.isNewHand = true;
            player.addHand(this.model);
            this.model.alreadyTaken = true;

            if ( this.lastTouchBy !== player.get("position") ) {
                statistic.takeOpponentSendCard = statistic.takeOpponentSendCard || 0;
                statistic.takeOpponentSendCard++;
            }

        } else {
            this.model.discard();
        }
    },
    render:function(){
        if ( this.model.get("side") === "front" ) {
            this.contentSprite.setSpriteFrame(cc.spriteFrameCache.getSpriteFrame("card-blank.png"));
            var suit = this.model.get("suit");

            var r = ( suit === SUIT_NUMBER_WATER || suit === SUIT_NUMBER_FIRE )?"r":"";
            if ( this.model.get("number") ) {
                this.numberSprite.setSpriteFrame(cc.spriteFrameCache.getSpriteFrame("number-" + this.model.get("number") + r + ".png"));
                this.numberDownSprite.setSpriteFrame(cc.spriteFrameCache.getSpriteFrame("number-" + this.model.get("number") + r + ".png"));
                this.numberSprite.setVisible(true);
                this.numberDownSprite.setVisible(true);
            } else {
                this.numberSprite.setVisible(false);
                this.numberDownSprite.setVisible(false);
            }
            this.suitSprite.setSpriteFrame(cc.spriteFrameCache.getSpriteFrame("icon-"+SUIT_ARRAY[this.model.get("suit")]+".png"));
            this.suitSprite.setVisible(true);
        } else {
            this.contentSprite.setSpriteFrame(cc.spriteFrameCache.getSpriteFrame("card-back.png"));
            this.suitSprite.setVisible(false);
            this.numberSprite.setVisible(false);
            this.numberDownSprite.setVisible(false);
        }

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
        this.model.on("change:speed",this.changeSpeed,this)
        this.model.on("destroy",this.onDestroy,this);

        this.model.on("crossX-"+BORDER_PADDING,function(){
            this.model.discard();
        },this)
        this.model.on("crossX"+(cc.winSize.width+BORDER_PADDING),function(){
            this.model.discard();
        },this)

    },
    closeEvent:function(){
        this.model.off("destroy",this.onDestroy);
        this.model.off("change:speed",this.changeSpeed)
    },
    onDestroy:function(){
        this.release();
        this.removeFromParent(true);
    },
    changeSpeed:function(){
        this.stopMove();
        this.moveToPosition(this.model.get("destX"),this.model.get("destY"),this.model.get("speed"))
    },
    dizzy:function(){
        this.contentSprite.runAction(cc.rotateBy(0.5,360).repeatForever())
    },
    shrink:function(){
        this.contentSprite.runAction(cc.scaleTo(0.1,1.1/1.5, 1.1/1.5));
    },
    enlarge:function(){
        this.contentSprite.runAction(cc.scaleTo(0.1,1.1*1.5, 1.1*1.5));
    },
    stopAllActions:function(){
        this._super();
        this.contentSprite.stopAllActions();
    },
    onTouchBegan:function(locationInNode){
    }
});