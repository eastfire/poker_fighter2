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
            cc.spriteFrameCache.getSpriteFrame("2player-menu.png"),
            cc.spriteFrameCache.getSpriteFrame("2player-menu.png"),
            function () {
                this.putStack(vsItem.x,vsItem.y,function(){
                    statistic.game = statistic.game || {};
                    var playedOnce = statistic.game.vs || statistic.game["vs-ai"]
                    if ( playedOnce ) {
                        cc.director.runScene(new ModeSelectScene({mode: "vs"}));
                    } else {
                        cc.director.runScene(new MainScene({
                            mode: "vs",
                            aiDifficulty: AI_DIFFICULTY_EASY,
                            itemPool : INIT_ITEMS
                        }));
                    }
                })
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
    },
    putStack:function(x,y,callback){
        if ( this.alreadyPutting ) return;
        this.alreadyPutting = true;

        cc.audioEngine.playEffect(res.chips2_mp3,false);

        var initY = y + 100;
        var interval = 0.06;
        var last = 5;
        var tokenHeight = 10;
        var tokens = [];
        for ( var i = 0; i < last; i++ ) {
            var tokenFrame = _.sample(["token-green.png","token-red.png","token-black.png"])
            var token = new cc.Sprite(cc.spriteFrameCache.getSpriteFrame(tokenFrame))
            token.attr({
                x: x,
                y: initY,
                opacity: 0
            })
            tokens.push(token)
            this.addChild(token);
            token.runAction(cc.sequence(
                cc.delayTime(i*interval),
                cc.fadeIn(0.01),
                cc.moveTo(0.2, x, y+i*tokenHeight).easing(cc.easeOut(3.0)),
                i === last-1 ? cc.callFunc(function(){
                    _.each(tokens,function(token){
                        token.removeFromParent(true);
                    },this)
                    this.alreadyPutting = false;
                    callback.call(this);
                }, this) : cc.callFunc(function(){}, this)
            ))
        }
    }
});

var IntroScene = cc.Scene.extend({
    onEnter:function () {
        this._super();

        var layer = new IntroLayer();
        this.addChild(layer);
    }
});
