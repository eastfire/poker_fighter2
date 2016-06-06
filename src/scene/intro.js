var APPID = 0; //TODO

var IntroLayer = cc.LayerColor.extend({
    ctor:function(){
        this._super(new cc.color(0x0,0x0,0x0));
//        this._super();
        var sprite = new cc.Sprite(res.intro_png);
        sprite.attr({
            x: cc.winSize.width/2,
            y: cc.winSize.height/2
        })
        this.addChild(sprite);

        this.initAudio();

        this.initTutorial();

        var lang = cc.sys.language;
        if ( lang != "zh" ) lang = "en";

        var startItem = new cc.MenuItemImage(
            cc.spriteFrameCache.getSpriteFrame("adventure-menu.png"),
            cc.spriteFrameCache.getSpriteFrame("adventure-menu.png"),
            function () {
                cc.director.runScene(new FightScene({
                    p1: new HeroModel({
                        position: PLAYER_POSITION_DOWN
                    }),
                    p2: new EnemyModel({
                        position: PLAYER_POSITION_UP
                    })

                }))
//                cc.director.runScene(new SkillListScene({
//                    skillList:[
//                        new SKILL_MODEL_MAP["light-attack"]({
//                            requireHand: HAND_2_PAIRS
//                        }),new SKILL_MODEL_MAP["heavy-attack"]({
//                            requireHand: HAND_FULL_HOUSE
//                        }),new SKILL_MODEL_MAP["weapon-enchant-fire"]({
//                            requireHand: HAND_STRAIGHT
//                        }),new SKILL_MODEL_MAP["shield-up"]({
//                            requireHand: HAND_HIGH_CARD
//                        })]
//                    }));
            }, this);
        startItem.attr({
            x: cc.winSize.width/2,
            y: 200,
            rotation: 0//-5
        });


        var menu = new cc.Menu([startItem]);
        menu.x = 0;
        menu.y = 0;
        this.addChild(menu);
    },
    initAudio:function(){
        var store = cc.sys.localStorage.getItem("poker_fighter.sound");
        if ( store != null ) {
            this.sound = store;
        } else {
            this.sound = 1;
        }
        cc.audioEngine.setEffectsVolume(this.sound);
    },
    initTutorial:function(){
        tutorialMap = null;
    }
});

var IntroScene = cc.Scene.extend({
    onEnter:function () {
        this._super();

        var layer = new IntroLayer();
        this.addChild(layer);
    }
});
