/**
 * Created by 赢潮 on 2015/10/29.
 */

var ACCELERATE_THRESHOLD_X = 0.2;
var ACCELERATE_THRESHOLD_Y = 0.2;

var PlayerRotateLayer = cc.LayerColor.extend({
    ctor: function (options) {
        this._super(colors.table);
        options = options || {}

        this.menuArray = [];
        this.initMenu();

        var menu = new cc.Menu(this.menuArray);
        menu.x = 0;
        menu.y = 0;
        this.addChild(menu);

        if( 'accelerometer' in cc.sys.capabilities && !options.disableRotate ) {
            var self = this;
            // call is called 30 times per second
            cc.inputManager.setAccelerometerInterval(1/30);
            cc.inputManager.setAccelerometerEnabled(true);
            cc.eventManager.addListener({
                event: cc.EventListener.ACCELERATION,
                callback: function(accelEvent, event){
                    var target = event.getCurrentTarget();
                    if ( Math.abs(accelEvent.x) < ACCELERATE_THRESHOLD_X ) {
                        if ( accelEvent.y > ACCELERATE_THRESHOLD_Y && self.rotation == 0 ) {
                            self.rotateLayer.call(self);
                        } else if ( accelEvent.y < -ACCELERATE_THRESHOLD_Y && self.rotation == 180 ) {
                            self.rotateLayer.call(self);
                        }
                    }
                }
            }, this);

        } else {
            cc.log("ACCELEROMETER not supported");
        }
    },
    initMenu:function(){
        var exitItem = new cc.MenuItemImage(
            cc.spriteFrameCache.getSpriteFrame("exit-default.png"),
            cc.spriteFrameCache.getSpriteFrame("exit-press.png"),
            function () {
                cc.audioEngine.playEffect(res.click_mp3,false);
                cc.director.popScene();
            }, this);
        exitItem.attr({
            scaleX: 0.5,
            scaleY: 0.5,
            x: 30,
            y: 30
        });
        this.menuArray.push(exitItem);
    },
    rotateLayer:function(){
        var rotation = (this.rotation + 180) % 360;
        this.runAction( cc.sequence( cc.rotateTo(times.letMeSee, rotation ),
            cc.callFunc(function(){
                this.onRotate(rotation)
            },this)));
    },
    onRotate:function(rotation){
    },
    onExit: function(){
        this._super();
        if( 'accelerometer' in cc.sys.capabilities )
            cc.inputManager.setAccelerometerEnabled(false);
    },
    makeLabel:function(text, x, y, fontSize){
        var fontSize = fontSize || 28;
        var label = new ccui.Text(text, "Arial", fontSize );
        label.enableOutline(cc.color.WHITE, 2);
        label.setTextColor(cc.color.BLACK);
        label.attr({
            x: x,
            y: y,
            zIndex: 50,
            anchorY: 0.5
        });
        return label;
    },
    renderButtonGroup:function(x,y,position, callback){
        var scaleX = 1;
        var img;
        if ( position == 0 || position == 2 ) {
            img = "left-button-group";
            if ( position == 2 ) {
                scaleX = -1;
            }
        } else {
            img = "middle-button-group";
        }
        var button = new cc.MenuItemImage(
            cc.spriteFrameCache.getSpriteFrame(img+"-default.png"),
            cc.spriteFrameCache.getSpriteFrame(img+"-press.png"),
            callback, this);
        button.attr({
            scaleX: scaleX,
            x: x,
            y: y
        });
        this.menuArray.push(button);
        return button;
    }
});

var SkillListLayer = PlayerRotateLayer.extend({
    initMenu:function(){
        this._super()
        this.currentY = cc.winSize.height - 50;
        this.startX = 50;
        var totalHeight = cc.winSize.height - 90;

        this.stepY = totalHeight / 10;
        this.renderSkillMenu( findValidSkill(this.skillList,HAND_5_OF_A_KIND),HAND_5_OF_A_KIND, this.currentY ); this.currentY -= this.stepY;
        this.renderSkillMenu( findValidSkill(this.skillList,HAND_STRAIGHT_FLUSH),HAND_STRAIGHT_FLUSH, this.currentY ); this.currentY -= this.stepY;
        this.renderSkillMenu( findValidSkill(this.skillList,HAND_4_OF_A_KIND),HAND_4_OF_A_KIND, this.currentY ); this.currentY -= this.stepY;
        this.renderSkillMenu( findValidSkill(this.skillList,HAND_FULL_HOUSE),HAND_FULL_HOUSE, this.currentY ); this.currentY -= this.stepY;
        this.renderSkillMenu( findValidSkill(this.skillList,HAND_FLUSH),HAND_FLUSH, this.currentY ); this.currentY -= this.stepY;
        this.renderSkillMenu( findValidSkill(this.skillList,HAND_STRAIGHT),HAND_STRAIGHT, this.currentY ); this.currentY -= this.stepY;
        this.renderSkillMenu( findValidSkill(this.skillList,HAND_3_OF_A_KIND),HAND_3_OF_A_KIND, this.currentY ); this.currentY -= this.stepY;
        this.renderSkillMenu( findValidSkill(this.skillList,HAND_2_PAIRS),HAND_2_PAIRS, this.currentY ); this.currentY -= this.stepY;
        this.renderSkillMenu( findValidSkill(this.skillList,HAND_1_PAIR),HAND_1_PAIR, this.currentY ); this.currentY -= this.stepY;
        this.renderSkillMenu( findValidSkill(this.skillList,HAND_HIGH_CARD),HAND_HIGH_CARD, this.currentY ); this.currentY -= this.stepY;
    },
    renderFeature: function (cards, feature) {
        var scale = 0.7;
        var stepX = dimens.card_size.width * scale;
        var x = this.startX;

        _.each(cards, function (card) {
            var sprite = new PokerCardSprite({
                model: new PokerCardModel({
                    suit: card.suit,
                    number: card.number
                })
            });
            sprite.attr({
                x: x,
                y: this.currentY,
                scaleX: scale,
                scaleY: scale
            });
            x += stepX;
            this.addChild(sprite);

        }, this);

        this.currentY -= this.stepY;
    },

    renderSkillMenu:function(skillModel, currentHandType, y){
        if ( !skillModel ){
            return;
        }

        if ( skillModel.get("requireHand") === currentHandType ) {
            var skillItem = new cc.MenuItemImage(
                cc.spriteFrameCache.getSpriteFrame("skill-menu-sword.png"),
                cc.spriteFrameCache.getSpriteFrame("skill-menu-sword.png"),
                function () {
                    cc.audioEngine.playEffect(res.click_mp3, false);
                }, this);
            skillItem.attr({
                x: 425,
                y: y
            });
            this.menuArray.push(skillItem);

            skillItem.addChild( this.makeLabel(texts.skill[skillModel.get("name")].name, 120, 60) )
        } else {
            if ( skillModel.get("acceptHigherHand") ) {
                this.addChild( this.makeLabel("同下", 370, y) )
            }
        }
    },
    ctor:function(options){
        this.skillList = options.skillList;

        this._super(options);

        var scale = 0.7;
        //straight flush
        this.currentY = cc.winSize.height - 50;
        this.startX = 50;
        var totalHeight = cc.winSize.height - 90;

        this.stepY = totalHeight / 10;
        this.renderFeature( [{ suit:SUIT_NUMBER_EARTH, number: 14}, { suit:SUIT_NUMBER_FIRE, number: 14}, {
                suit:SUIT_NUMBER_AIR, number: 14}, { suit:SUIT_NUMBER_WATER, number: 14}, { suit:SUIT_NUMBER_BLANK, number: 14}],
            "five-of-a-kind" );
        this.renderFeature( [{ suit:SUIT_NUMBER_EARTH, number: 13}, { suit:SUIT_NUMBER_EARTH, number: 12}, { suit:SUIT_NUMBER_EARTH, number: 11},
            { suit:SUIT_NUMBER_EARTH, number: 10}, { suit:SUIT_NUMBER_EARTH, number: 9}],  "straight-flush" );
        this.renderFeature( [{ suit:SUIT_NUMBER_EARTH, number: 13}, { suit:SUIT_NUMBER_FIRE, number: 13}, {
                suit:SUIT_NUMBER_AIR, number: 13}, { suit:SUIT_NUMBER_WATER, number: 13}, {suit:SUIT_NUMBER_BLANK, number:0}],
            "four-of-a-kind" );
        this.renderFeature( [{ suit:SUIT_NUMBER_EARTH, number: 14}, { suit:SUIT_NUMBER_FIRE, number: 14}, {
                suit:SUIT_NUMBER_AIR, number: 14}, { suit:SUIT_NUMBER_EARTH, number: 10}, { suit:SUIT_NUMBER_FIRE, number: 10}],
            "full-house" );
        this.renderFeature( [{ suit:SUIT_NUMBER_FIRE, number: 14}, { suit:SUIT_NUMBER_FIRE, number: 13}, {
                suit:SUIT_NUMBER_FIRE, number: 11}, { suit:SUIT_NUMBER_FIRE, number: 9}, { suit:SUIT_NUMBER_FIRE, number: 8}],
            "flush" );
        this.renderFeature( [{ suit:SUIT_NUMBER_EARTH, number: 14}, { suit:SUIT_NUMBER_FIRE, number: 13}, {
                suit:SUIT_NUMBER_AIR, number: 12}, { suit:SUIT_NUMBER_EARTH, number: 11}, { suit:SUIT_NUMBER_FIRE, number: 10}],
            "straight" );
        this.renderFeature( [{ suit:SUIT_NUMBER_EARTH, number: 14}, { suit:SUIT_NUMBER_FIRE, number: 14}, {
                suit:SUIT_NUMBER_AIR, number: 14}, {suit:SUIT_NUMBER_BLANK, number:0}, {suit:SUIT_NUMBER_BLANK, number:0}],
            "three-of-a-kind" );
        this.renderFeature( [{ suit:SUIT_NUMBER_EARTH, number: 14}, { suit:SUIT_NUMBER_FIRE, number: 14}, { suit:SUIT_NUMBER_EARTH, number: 10}, { suit:SUIT_NUMBER_FIRE, number: 10}, {suit:SUIT_NUMBER_BLANK, number:0}],
            "two-pair" );
        this.renderFeature( [{ suit:SUIT_NUMBER_EARTH, number: 14}, { suit:SUIT_NUMBER_FIRE, number: 14}, {suit:SUIT_NUMBER_BLANK, number:0}, {suit:SUIT_NUMBER_BLANK, number:0}, {suit:SUIT_NUMBER_BLANK, number:0}],
            "one-pair" );
        this.renderFeature( [{ suit:SUIT_NUMBER_EARTH, number: 13}, {suit:SUIT_NUMBER_BLANK, number:0}, {suit:SUIT_NUMBER_BLANK, number:0}, {suit:SUIT_NUMBER_BLANK, number:0}, {suit:SUIT_NUMBER_BLANK, number:0}],
            "high-card" );
    }
});

var SkillListScene = cc.Scene.extend({
    ctor:function(options){
        this._super();
        this.options = _.extend(options,{disableRotate:true})
    },
    onEnter:function () {
        this._super();
        var layer = new SkillListLayer(this.options);
        this.addChild(layer);
    }
});
