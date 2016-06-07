var FightLayer = cc.Layer.extend({
    ctor:function(options) {
        this._super();
//        this._super();
        this.model = options.model;

        this._touchInstanceUsed = {};

        var sprite = new cc.Sprite(res.battle_field0);
        sprite.attr({
            x: cc.winSize.width / 2,
            y: cc.winSize.height / 2
        })
        this.addChild(sprite);

        for ( var i = 0; i < 5; i++) {
            var card = new PokerCardSprite({
                model: new PokerCardModel({
                    suit: SUIT_NUMBER_FIRE,
                    number: 8+i,
                    owner: PLAYER_POSITION_DOWN
                })
            })
            card.attr({
                x: 100, y: 100*i+150
            })
            this.addChild(card);
        }

        //card.moveToPosition(cc.winSize.width+150,300,200)

        window.testCard = card;

        this.initEvent();

        this.initCharacterPanel();
    },
    initCharacterPanel: function () {
        this.p1Panel = new CharacterPanel({model:this.model.get("p1")})
        this.p1Panel.attr({
            x: cc.winSize.width/2,
            y: dimens.player1Y/2
        })
        this.addChild(this.p1Panel)
        this.p2Panel = new CharacterPanel({model:this.model.get("p2")})
        this.p2Panel.attr({
            x: cc.winSize.width/2,
            y: cc.winSize.height - dimens.player1Y/2
        })
        this.addChild(this.p2Panel)
    },
    initEvent:function(){
        cc.eventManager.addListener(this.listener = cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: function (touch, event) {
                var target = event.getCurrentTarget();
                var locationInNode = target.convertToNodeSpace(touch.getLocation());
                var touchId = cc.sys.isNative ? touch.getID() : touch.__instanceId;
                _.each( target.getChildren(), function(sprite) {
                    if (sprite instanceof MovableSprite && sprite.canBeTouch(locationInNode) && (!target._touchInstanceUsed[touchId] || sprite.touchingInstanceId === touchId )) {
                        var realWidth = sprite.contentSprite.width*sprite.contentSprite.scaleX;
                        var realHeight = sprite.contentSprite.height*sprite.contentSprite.scaleY;
                        var rect = cc.rect(sprite.x - realWidth / 2, sprite.y - realHeight / 2, realWidth, realHeight);
                        if (cc.rectContainsPoint(rect, locationInNode)){
                            sprite.touchingInstanceId = touchId;
                            if (locationInNode.y >= cc.winSize.height / 2) {
                                sprite.speedY = NATURE_SPEED;
                            } else {
                                sprite.speedY = -NATURE_SPEED;
                            }
                            sprite.speedX = 0;
                            sprite.onTouchBegan(locationInNode);
                        }
                    }
                },target);
                return true;
            },
            //Trigger when moving touch
            onTouchMoved: function (touch, event) {
                var target = event.getCurrentTarget();
                var locationInNode = target.convertToNodeSpace(touch.getLocation());
                if ( fightModel.get("p2").get("type") === PLAYER_TYPE_AI && locationInNode.y > cc.winSize.height/2 ) return;
                var touchId = cc.sys.isNative ? touch.getID() : touch.__instanceId;
                _.each( target.getChildren(), function(sprite){
                    if ( sprite instanceof MovableSprite && sprite.model.getInteractable() && (!target._touchInstanceUsed[touchId] || sprite.touchingInstanceId === touchId ) ) {
                        var padding = 0;
                        var realWidth = sprite.contentSprite.width*sprite.contentSprite.scaleX;
                        var realHeight = sprite.contentSprite.height*sprite.contentSprite.scaleY;
                        var rect = cc.rect(sprite.x-realWidth/2+padding, sprite.y-realHeight/2+padding,
                                realWidth-2*padding, realHeight-2*padding);

                        //Check the click area
                        if (cc.rectContainsPoint(rect, locationInNode)){
                            if ( sprite.canBeTouch(locationInNode) ) {
                                sprite.stopAllActions();
                                sprite.touchingInstanceId = touchId;
                                target._touchInstanceUsed[touchId] = true;
                                var delta = touch.getDelta();
                                sprite.x += delta.x;
                                sprite.y += delta.y;
                                sprite.speedX = delta.x * 50;
                                if (delta.y == 0) {
                                    if (sprite.y >= cc.winSize.height / 2) {
                                        sprite.speedY = NATURE_SPEED;
                                    } else {
                                        sprite.speedY = -NATURE_SPEED;
                                    }
                                } else {
                                    sprite.speedY = delta.y * 50;
                                }
                            } else {
                                sprite.touchingInstanceId = null;
                                delete target._touchInstanceUsed[touchId];
                                sprite.lastTouchBy = (locationInNode.y >= cc.winSize.height / 2) ? PLAYER_POSITION_UP : PLAYER_POSITION_DOWN;
                                sprite.onTouchRelease.call(sprite);
                            }
                        } else if ( sprite.touchingInstanceId === touchId ) {
                            sprite.touchingInstanceId = null;
                            delete target._touchInstanceUsed[touchId];
                            sprite.lastTouchBy = (locationInNode.y >= cc.winSize.height / 2) ? PLAYER_POSITION_UP : PLAYER_POSITION_DOWN;
                            sprite.onTouchRelease.call(sprite);
                        }
                    }
                },target);
            },
            //Process the touch end event
            onTouchEnded: function (touch, event) {
                var target = event.getCurrentTarget();
                var locationInNode = target.convertToNodeSpace(touch.getLocation());
                var prevLocationInNode = target.convertToNodeSpace(touch.getPreviousLocation());
                var touchId = cc.sys.isNative ? touch.getID() : touch.__instanceId;
                _.each( target.getChildren(), function(sprite){
                    if ( sprite instanceof MovableSprite && sprite.model.getInteractable() ) {
                        //Check the click area
                        if ( sprite.touchingInstanceId === touchId ){
                            sprite.touchingInstanceId = null;
                            sprite.lastTouchBy = (locationInNode.y >= cc.winSize.height / 2) ? PLAYER_POSITION_UP : PLAYER_POSITION_DOWN;
                            sprite.onTouchRelease.call(sprite);
                        }
                    }
                },target);
                delete target._touchInstanceUsed[touchId];
            }
        }), this);
    }
});

var FightScene = cc.Scene.extend({
    ctor:function(options){
        this._super();
        this.options = options;
    },
    onEnter:function () {
        this._super();
        if ( window.fightModel )
            return;
        window.fightModel = new FightModel(this.options);
        window.mainLayer = new FightLayer({model:fightModel});
        this.addChild(window.mainLayer);
    }
});