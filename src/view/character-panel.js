var CharacterPanel = cc.Sprite.extend({
    ctor:function(options) {
        this._super();
        this.model = options.model;

        this.initHpBar();
        this.initManaBar();

        this.initSkillLabel();
    },
    initHpBar:function(){
        var hpIcon = new cc.Sprite(cc.spriteFrameCache.getSpriteFrame("icon-hp.png"))
        var hpBarBg = new cc.Sprite(cc.spriteFrameCache.getSpriteFrame("bar.png"))
        this.hpBar = new cc.Sprite(cc.spriteFrameCache.getSpriteFrame("hp-bar.png"))
        if (this.model.get("position") === PLAYER_POSITION_UP) {
            hpBarBg.attr({
                x: -cc.winSize.width/2 + 22,
                y: -45,
                scaleX: 2,
                scaleY: 2,
                anchorX: 0,
                anchorY:0.5
            })
            hpIcon.attr({
                x: -cc.winSize.width/2 + 10,
                y: -45,
                scaleX: 0.5,
                scaleY: 0.5
            })
            this.hpBar.attr({
                x: 2,
                y: 6,
                scaleX: 0,
                anchorX: 0,
                anchorY:0.5
            })
        } else {
            hpBarBg.attr({
                x: -cc.winSize.width/2 + 22,
                y: 60,
                scaleX: 2,
                scaleY: 2,
                anchorX: 0
            })
            hpIcon.attr({
                x: -cc.winSize.width/2 + 10,
                y: 60,
                scaleX: 0.5,
                scaleY: 0.5
            })
            this.hpBar.attr({
                x: 2,
                y: 6,
                scaleX: 0,
                anchorX: 0,
                anchorY:0.5
            })
        }
        this.addChild(hpIcon);
        this.addChild(hpBarBg);
        hpBarBg.addChild(this.hpBar);


        this.renderHp();
    },
    initManaBar:function(x,y){
        var manaIcon = new cc.Sprite(cc.spriteFrameCache.getSpriteFrame("icon-mana.png"))
        var manaBarBg = new cc.Sprite(cc.spriteFrameCache.getSpriteFrame("bar.png"))
        this.manaBar = new cc.Sprite(cc.spriteFrameCache.getSpriteFrame("mana-bar.png"))
        if (this.model.get("position") === PLAYER_POSITION_UP) {
            manaBarBg.attr({
                x: -cc.winSize.width/2 + 22,
                y: -60,
                scaleX: 2,
                scaleY: 2,
                anchorX: 0
            })
            manaIcon.attr({
                x: -cc.winSize.width/2 + 10,
                y: -60,
                scaleX: 0.5,
                scaleY: 0.5
            })
        } else {
            manaBarBg.attr({
                x: -cc.winSize.width/2 + 22,
                y: 45,
                scaleX: 2,
                scaleY: 2,
                anchorX: 0
            })
            manaIcon.attr({
                x:  -cc.winSize.width/2 + 10,
                y: 45,
                scaleX: 0.5,
                scaleY: 0.5
            })
        }
        this.addChild(manaIcon);
        this.addChild(manaBarBg);

        this.manaBar.attr({
            x: 2,
            y: 6,
            scaleX: 0,
            anchorX: 0,
            anchorY:0.5
        })
        manaBarBg.addChild(this.manaBar);


        this.renderMana();
    },
    onHpChange:function(){
        this.renderHp();
    },
    onManaChange:function(){
        this.renderMana();
    },
    renderHp:function(){
        var value = Math.round( this.model.get("hp") / this.model.get("maxHp") * 92)
        this.hpBar.stopActionByTag(ACTION_TAG_BAR_CHANGE);
        this.hpBar.runAction(cc.scaleTo(times.barChange, value, this.hpBar.scaleY)).setTag(ACTION_TAG_BAR_CHANGE)
    },
    renderMana:function(){
        var value = Math.round( this.model.get("mana") / this.model.get("maxMana") * 92)
        this.manaBar.stopActionByTag(ACTION_TAG_BAR_CHANGE);
        this.manaBar.runAction(cc.scaleTo(times.barChange, value, this.manaBar.scaleY)).setTag(ACTION_TAG_BAR_CHANGE)
    },
    initSkillLabel:function(){
        this.featureLabel = new ccui.Text("", "Arial", 24 );
        this.featureLabel.enableOutline(cc.color.WHITE, 2);
        this.featureLabel.setTextColor(cc.color.BLACK);
        this.featureLabel.attr({
            x: 0,
            y: 20
        });
        this.featureLabel.setVisible(false)

        this.skillNameLabel = new ccui.Text("", "Arial", 30 );
        this.skillNameLabel.enableOutline(cc.color.WHITE, 2);
        this.skillNameLabel.setTextColor(cc.color.BLACK);
        this.skillNameLabel.attr({
            x: 0,
            y: -20
        });
        this.skillNameLabel.setVisible(false)

        this.addChild(this.featureLabel)
        this.addChild(this.skillNameLabel)
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
        this.model.on("before-perform-skill",this.onTryPerformSkill, this);
        this.model.on("perform-skill",this.onPerformSkill, this);
        this.model.on("change:hp",this.onHpChange,this)
        this.model.on("change:mana",this.onManaChange,this)
    },
    closeEvent:function(){
        this.model.off(null,null,this);
    },
    render:function(){

    },
    onTryPerformSkill:function(skillModel, feature){
        this.featureLabel.setString( texts.handTypeById[feature.typeId])
        this.featureLabel.setVisible(true)
        this.skillNameLabel.setString( texts.skill[skillModel.get("name")].name)
        this.skillNameLabel.setVisible(true)
        this.featureLabel.attr({
            scaleX: 0.5,
            scaleY: 0.5,
            opacity: 0
        })
        this.skillNameLabel.attr({
            scaleX: 0.5,
            scaleY: 0.5,
            opacity: 0
        })
        this.featureLabel.runAction(cc.spawn(
            cc.fadeIn(times.cardUsed),
            cc.scaleTo(times.cardUsed,1,1)
        ))
        this.skillNameLabel.runAction(cc.spawn(
            cc.fadeIn(times.cardUsed),
            cc.scaleTo(times.cardUsed,1,1)
        ))
    },
    onPerformSkill:function(skillModel, feature){
        var self = this;
        //TODO new skill view
        skillModel.onUse(feature);
        //TODO afterPerformSkill shall be called by skillView
        this.scheduleOnce(function(){
            self.afterPerformSkill(skillModel,feature)
        },1)
    },
    afterPerformSkill:function(skillModel, feature){
        this.featureLabel.runAction(
            cc.sequence(
                cc.fadeOut(times.performSkill),
                cc.callFunc(function(){
                    this.skillNameLabel.setVisible(false)
                },this)
            ))
        this.skillNameLabel.runAction(cc.sequence(
            cc.fadeOut(times.performSkill),
            cc.callFunc(function(){
                this.skillNameLabel.setVisible(false)
            },this)
        ))
        this.model.afterPerformSkill(skillModel, feature)
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

        var self = this;
        this.scheduleOnce(function(){
            self.model.checkFullHand()
        }, times.card_sort+0.1);
    }
})