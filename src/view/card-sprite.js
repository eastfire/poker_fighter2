

var MIN_SPEED = 100;
var MAX_SPEED = 400;

var NormalCardSprite = cc.Sprite.extend({
    ctor:function(options) {
        this._super();
        this.retain();
        this.model = options.model;

        this.setName(this.model.cid);

        this.contentSprite = new cc.Sprite();
        this.addChild(this.contentSprite);

        this.initView();
    },
    initView:function(){
    },
    onTouchRelease:function(){
        var target = this;
        if ( target.y < dimens.player1Y ) {
            target.playerTakeCard.call(target, gameModel.player1);
            return;
        }
        if ( target.y > dimens.player2Y ) {
            target.playerTakeCard.call(target, gameModel.player2);
            return;
        }

        target.stopAllActions();

        var player1Y = dimens.player1Y;
        var player2Y = dimens.player2Y;

        var midY = cc.winSize.height/2;
        if ( target.speedY > 0 ) {
            if ( target.y < midY ) {
                target.moveToLine.call(target, gameModel.player1, midY, function(){
                    target.stopAllActions();
                    this.moveToLine.call(this, gameModel.player2, player2Y, function(){
                        this.playerTakeCard.call(this, gameModel.player2);
                    }, this);
                    //check size
                    var newSizeScale = gameModel.player2.getSizeAdjust();
                    this.contentSprite.runAction(cc.scaleTo(0.1, newSizeScale, newSizeScale));
                    //dizzy
                    if ( gameModel.player2.get("dizzy") )
                        this.dizzy();
                    else this.contentSprite.rotation = 180;

                    if ( this.__finger ) this.__finger.removeFromParent(true);
                }, target);
                //check size
                var newSizeScale = gameModel.player1.getSizeAdjust();
                this.contentSprite.runAction(cc.scaleTo(0.1, newSizeScale, newSizeScale));
                //dizzy
                if ( gameModel.player1.get("dizzy") )
                    this.dizzy();
            } else {
                target.moveToLine.call(target, gameModel.player2, player2Y, function(){
                    target.playerTakeCard.call(target, gameModel.player2);

                    if ( target.__finger ) target.__finger.removeFromParent(true);
                }, target);
                //check size
                var newSizeScale = gameModel.player2.getSizeAdjust();
                this.contentSprite.runAction(cc.scaleTo(0.1, newSizeScale, newSizeScale));
                //dizzy
                if ( gameModel.player2.get("dizzy") )
                    this.dizzy();
            }
        } else if ( target.speedY < 0 ) {
            if ( target.y >= midY ) {
                target.moveToLine.call(target, gameModel.player2, midY, function(){
                    target.stopAllActions();
                    this.moveToLine.call(this, gameModel.player1, player1Y, function(){
                        this.playerTakeCard.call(this, gameModel.player1);
                    }, this);
                    //check size
                    var newSizeScale = gameModel.player1.getSizeAdjust();
                    this.contentSprite.runAction(cc.scaleTo(0.1, newSizeScale, newSizeScale));
                    //dizzy
                    if ( gameModel.player1.get("dizzy") )
                        this.dizzy();
                    else this.contentSprite.rotation = 0;

                    if ( this.__finger ) this.__finger.removeFromParent(true);
                }, target);
                //check size
                var newSizeScale = gameModel.player2.getSizeAdjust();
                this.contentSprite.runAction(cc.scaleTo(0.1, newSizeScale, newSizeScale));
                //dizzy
                if ( gameModel.player2.get("dizzy") )
                    this.dizzy();
            } else {
                target.moveToLine.call(target, gameModel.player1, player1Y, function(){
                    target.playerTakeCard.call(target, gameModel.player1);

                    if ( target.__finger ) target.__finger.removeFromParent(true);
                }, target);
                //check size
                var newSizeScale = gameModel.player1.getSizeAdjust();
                this.contentSprite.runAction(cc.scaleTo(0.1, newSizeScale, newSizeScale));
                //dizzy
                if ( gameModel.player1.get("dizzy") )
                    this.dizzy();
            }
        } else if ( target.speedY == 0 ) {
            var actionArray = [];
            this.speed = this.getSpeed();
            if ( target.y < midY ) {
                target.speedScale = gameModel.player1.getSpeedAdjust()
            } else target.speedScale = gameModel.player2.getSpeedAdjust()

            if ( target.speedX < 0 ) {
                var time = ( target.x - ( - dimens.card_size.width/2 ) ) / (this.speed * this.speedScale);
                actionArray.push(new cc.MoveTo(time, - dimens.card_size.width/2, target.y));
                actionArray.push(new cc.CallFunc(function () {
                    gameModel.destroyCard(target.model);
                }, target));
            } else if ( target.speedX > 0 ) {
                var time = ( cc.winSize.width + dimens.card_size.width/2 - target.x ) / (this.speed * this.speedScale);
                actionArray.push(new cc.MoveTo(time, cc.winSize.width + dimens.card_size.width/2, target.y));
                actionArray.push(new cc.CallFunc(function () {
                    gameModel.destroyCard(target.model);
                }, target));
            }
            target.runAction( new cc.Sequence(actionArray) );

            if ( target.y < midY ) {
                //check size
                var newSizeScale = gameModel.player1.getSizeAdjust();
                this.contentSprite.runAction(cc.scaleTo(0.1, newSizeScale, newSizeScale));
                //check dizzy
                if ( gameModel.player1.get("dizzy") )
                    this.dizzy();
            } else {
                //check size
                var newSizeScale = gameModel.player2.getSizeAdjust();
                this.contentSprite.runAction(cc.scaleTo(0.1, newSizeScale, newSizeScale));
                //check dizzy
                if ( gameModel.player2.get("dizzy") )
                    this.dizzy();
            }
        }
    },
    canBeTouch:function(locationInNode){
        if ( this.alreadyTaken ) return false;
        if ( gameModel.player2.get("type") == PLAYER_TYPE_AI ) {
            if ( gameModel.player1.get("type") == PLAYER_TYPE_AI ) return false;
            if ( this.y > cc.winSize.height/2 + this.height/2 ) return false;
        } else if ( gameModel.player1.get("type") == PLAYER_TYPE_AI && this.y < cc.winSize.height/2 - this.height/2 ) return false;
        return true;
    },
    bounceBackByFullHand:function(){
        cc.audioEngine.playEffect(res.spring_mp3, false);
        this.bounceBack();
    },
    bounceBackByShield:function(){
        cc.audioEngine.playEffect(res.shield_hit_mp3, false);
        this.bounceBack();
    },
    bounceBack:function(){
        this.stopAllActions();
        if ( this.y < cc.winSize.height/2 ) {
            this.y = dimens.player1Y + 1;
            this.lastTouchBy = null;
        } else {
            this.y = dimens.player2Y - 1;
            this.lastTouchBy = null;
        }

        this.speedY = -this.speedY;
        this.onTouchRelease();
    },
    blowAway:function(tornadoX, tornadoW){
        cc.audioEngine.playEffect(res.tornado_mp3, false);
        this.stopAllActions();
        var delta;
        if ( this.y < cc.winSize.height/2 ) {
            this.y = dimens.player1Y + 1;
            delta = 10;
        } else {
            this.y = dimens.player2Y - 1;
            delta = -10;
        }

        var actions = [];
        actions.push( cc.moveTo(0.05, tornadoX, this.y) );
        actions.push( cc.moveTo(0.15, tornadoX+tornadoW/3, this.y + delta) );
        actions.push( cc.moveTo(0.15, tornadoX-tornadoW/2, this.y + delta * 2) );
        actions.push( cc.moveTo(0.1, tornadoX+tornadoW/2, this.y + delta * 3) );
        actions.push( cc.callFunc(function(){
            this.lastTouchBy = null;
            this.speedX = NATURE_SPEED * 2 * Math.random();
            this.speedY = NATURE_SPEED * delta / 10;
            this.onTouchRelease();
        }, this) );
        this.runAction(cc.sequence(actions));
    },
    playerTakeCard:function(player){
        if ( this.alreadyTaken )
            return;
        if ( mainLayer.getPlayerSpriteByModel(player).checkBlowAway(this) ) {
            return;
        }
        if ( mainLayer.getPlayerSpriteByModel(player).checkShield(this) ) {
            return;
        }
        if ( player.canTakeCard() ) {
            this.stopAllActions();
            this.isNewHand = true;
            this.setTag(0);
            player.addHand(this.model);
            this.alreadyTaken = true;
            this.model.alreadyTaken = true;

            if ( this.lastTouchBy !== player.get("position") ) {
                statistic.takeOpponentSendCard = statistic.takeOpponentSendCard || 0;
                statistic.takeOpponentSendCard++;
            }

        } else {
            this.bounceBackByFullHand();
        }
    },
    moveToPoint:function(x,y, callback, context){
        this.destX = x;
        this.destY = y;
        var speed = this.speed * this.speedScale;
        var time = Math.sqrt((this.x - x) * (this.x - x) + (this.y - y) * (this.y - y)) / speed;
        this.moveCallback = callback;
        this.moveContext = context;
        this.runAction( cc.sequence( cc.moveTo(time, x,y), cc.callFunc(callback, context) ) );
    },
    changeSpeed:function(speedScale){
        this.speedScale = speedScale;
        var speed = this.speed * speedScale;
        var time = Math.sqrt((this.x - this.destX) * (this.x - this.destX) + (this.y - this.destY) * (this.y - this.destY)) / speed;
        this.runAction( cc.sequence( cc.moveTo(time, this.destX,this.destY), cc.callFunc(this.moveCallback, this.moveContext) ) );
    },
    getSpeed:function(){
        var originSpeed = Math.max(MIN_SPEED, Math.sqrt( this.speedX*this.speedX + this.speedY * this.speedY ) );
        var speed = Math.min(originSpeed, MAX_SPEED);
        return speed;
    },

    moveToLine:function(player, lineY, callback, context){
        var pointX = this.getCrossPointX.call(this, lineY);
        this.speedScale = player.getSpeedAdjust();
        this.speed = this.getSpeed();
        if (pointX > -dimens.card_size.width / 2 && pointX < cc.winSize.width + dimens.card_size.width / 2) {
            this.moveToPoint(pointX, lineY, callback, context);
        } else {
            this.moveToPoint(pointX, lineY, function(){
                gameModel.destroyCard(this.model);
            },this);
        }
    },
    getCrossPointX:function(lineY){
        return ( lineY - this.y ) * this.speedX / this.speedY + this.x;
    },
    render:function(){
        if ( this.model.get("side") === "front" ) {
            var suit = this.model.get("suit");

            var r = ( suit === 1 || suit === 3 )?"r":"";
            this.numberSprite.setSpriteFrame(cc.spriteFrameCache.getSpriteFrame("number-" + this.model.get("number") + r + ".png"));
            this.numberDownSprite.setSpriteFrame(cc.spriteFrameCache.getSpriteFrame("number-" + this.model.get("number") + r + ".png"));
            this.numberSprite.setVisible(true);
            this.numberDownSprite.setVisible(true);
        } else {
            this.contentSprite.setSpriteFrame(cc.spriteFrameCache.getSpriteFrame("card-back.png"));
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
        this.model.on("destroy",this.onDestroy,this);
    },
    closeEvent:function(){
        this.model.off("destroy",this.onDestroy);
    },
    onDestroy:function(){
        this.release();
        this.removeFromParent(true);
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

var PokerCardSprite = NormalCardSprite.extend({
    initView:function(){
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
    }
})
