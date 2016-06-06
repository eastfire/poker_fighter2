
var ACE_UNLOCK_CONDITION = 3;
var DOWNWARD_UNLOCK_CONDITION = 15;
var ENLARGE_UNLOCK_CONDITION = 5;
var FORBID_UNLOCK_CONDITION = 100;
var HAMMER_UNLOCK_CONDITION = 1;
var KATANA_UNLOCK_CONDITION = 3;
var KISS_UNLOCK_CONDITION = 10;
var LEAF_UNLOCK_CONDITION = 1;
var MAGNET_UNLOCK_CONDITION = 400;
var NUKE_UNLOCK_CONDITION = 1000;
var SHIELD_UNLOCK_CONDITION = 100;
var THIEF_UNLOCK_CONDITION = 1000;
var TWO_UNLOCK_CONDITION = 2;
var UPWARD_UNLOCK_CONDITION = 10;
var VASE_UNLOCK_CONDITION = 60;

var texts_locale = {
    zh: {
        win:"胜利",
        lose:"失败",
        tie:"平手",
        handTypeDisplayName: {
            "five-of-a-kind": "五条",
            "straight-flush": "同花顺",
            "four-of-a-kind": "四条",
            "full-house": "满堂红",
            "flush": "同花",
            "straight": "顺子",
            "three-of-a-kind": "三条",
            "two-pair": "两对",
            "one-pair": "一对",
            "high-card": "散牌",
            "no-card": "没牌"
        },

        skill:{
            "light-attack":{
                name:"轻攻击"
            },
            "middle-attack":{
                name:"中攻击"
            },
            "heavy-attack":{
                name:"重攻击"
            },
            "shield-up":{
                name:"架盾"
            },
            "weapon-enchant-fire":{
                name:"武器附魔（火）"
            }
        },

        aiLevel:[ "简单AI","普通AI", "困难AI","疯狂AI"],

        language: "语言",
        followSystem:"跟随系统",
        enLang:"English",
        zhLang:"简体中文",
        clearData:"",

        startGame: "开始游戏",
        useDefault: "默认",
        returnToIntro: "返回",

        gameOver: "GAME OVER",

        tutorials: {
            touchThisCard: "请点击这张牌。",
            showYourCard: "你得到了自己的第一张牌\n长按这个区域可以查看自己的手牌\n别让对手偷瞄到哦 ;)",
            collectYourCard:"在游戏过程中，你要不断收集手牌\n将手牌组成扑克牌的牌型\n牌型比对手大时就能赢得对手的钱。",
            thisIsYourMoney: "这是你的钱。\n如果你没钱了，你就输掉了游戏！",
            thisIsYourTarget: "这是你的目标金钱。\n如果你的钱达到这个数字，\n并且赢了一局，你就赢得游戏胜利！",
            thisIsForbidLine: "这是iOS浏览器的禁断之线。\n请勿在此区域向右滑动\n否则世界就会毁灭！",
            thisIsCountDown:"当任何一方得到５张手牌\n留给另一方的时间只剩下５秒",
            compareHands: "当倒计时结束，\n将亮出双方的牌，\n比较规则类似简化的梭哈或德州扑克\n首先比较牌型，牌型较强的一方胜。",
            compareHands2: "如果牌型相同，\n比较参与牌型的关键牌中最大的一张牌的数字\n(例如：满堂红中组成三条的牌)",
            compareHands3: "如果仍旧相同，\n则双方算平手。\n不再比较花色或其他牌。",
            betHelp:"牌型胜者得到败者的钱。\n钱数等于双方的牌型对应的赌注之和，\n乘以当前赔率。",
            handHelp: "点击此按钮查看\n牌型大小及其对应的赌注金额。",
            betRateIncrease: "赔率每经过一局会增加１",

            modeSelectIntro: "在这里，你可以定制每一局的玩法",
            selectInitMoney: "你可以调整每个玩家的起始金钱",
            selectTargetMoney: "你可以调整每个玩家的胜利目标",
            selectDeck: "你可以决定游戏使用的牌堆\n是8～A共28张牌\n或是2～A共52张牌",
            selectToken: "你可以调整游戏中筹码的出现概率",
            selectItem: "你可以调整游戏中道具的出现概率",
            selectEachItem: "你还可以单独控制每种道具是否出现",
            changeAI: "点击这里调整AI的难度"
        },

        items: {
            unknown: "未知",
            charge_before: "(可用",
            charge_after: "次)",
            on: "已开启",
            off: "已关闭",
            locked: "未解锁",

            "unused":"你需要使用过这个道具一次才能在配置中停用或启用这个道具。",
            "ace":{
                name:"A",
                desc:"召唤一张无花色的A朝自己移动。",
                unlock: "在公平竞赛中战胜普通以上难度AI "+ACE_UNLOCK_CONDITION+"次后解锁本道具。"
            },
            bomb:{
                name:"炸弹",
                desc:"朝对手扔出一颗炸弹。如进入他的手牌，可以随机破坏他的一张手牌，但如果对手手牌已满则无效。小心，对手可以把它丢回来哦。"
            },
            cloud:{
                name:"行云",
                desc:"召唤很多行云干扰对手的视线。"
            },
            diamond:{
                name:"钻石",
                desc:"吸引全场的Q朝自己移动。"
            },
            dizzy:{
                name:"眩晕",
                desc:"对手的牌、筹码、道具不停旋转，持续10秒。"
            },
            downward:{
                name:"赔率下降",
                desc:"本轮赔率随机下降１～４，但不会小于１。\n多个本道具的效果不会叠加，而是覆盖之前的数值。",
                unlock: "赔率达到"+DOWNWARD_UNLOCK_CONDITION+"后解锁本道具。"
            },
            enlarge:{
                name:"放大",
                desc:"放大自己的牌、筹码、道具，持续10秒。",
                unlock: "双人对战"+ENLARGE_UNLOCK_CONDITION+"次后解锁本道具。"
            },
            fast:{
                name:"快进",
                desc:"对手的牌、筹码、道具运动速度加快，持续10秒"
            },
            forbid:{
                name:"禁止",
                desc:"对手无法使用或获得道具。",
                unlock: "使用道具"+FORBID_UNLOCK_CONDITION+"次后解锁本道具。"
            },
            hammer:{
                name:"雷神之锤",
                desc:"召唤一个神锤击向对方区域。消灭任何打到的东西，吹飞敌方区域所有东西。",
                unlock: "得到"+HAMMER_UNLOCK_CONDITION+"次五条的牌型后解锁本道具。"
            },
            "katana":{
                name:"利剑",
                desc:"斩击对手区域中部的牌或筹码。",
                unlock: "在公平竞赛中战胜困难以上难度AI "+KATANA_UNLOCK_CONDITION+"次后解锁本道具。"
            },
            kiss:{
                name:"热吻",
                desc:"吸引全场的K和J朝自己移动。",
                unlock: "双人对战"+KISS_UNLOCK_CONDITION+"次后解锁本道具。"
            },
            leaf:{
                name:"落叶",
                desc:"召唤很多落叶干扰对手的视线。",
                unlock: "得到"+LEAF_UNLOCK_CONDITION+"次同花顺的牌型后解锁本道具。"
            },
            magnet:{
                name:"金钱磁铁",
                desc:"吸引全场的筹码朝自己移动（包括假的）",
                unlock:"得到"+MAGNET_UNLOCK_CONDITION+"次筹码后解锁本道具。"
            },
            nuke:{
                name:"核弹",
                desc:"消灭全场的牌、筹码和所有玩家的手牌。倒计时也会取消。",
                unlock: "消灭"+NUKE_UNLOCK_CONDITION+"张牌后解锁本道具。"
            },
            shield:{
                name:"护盾",
                desc:"弹回对手送来的任何坏东西，持续10秒。",
                unlock: "得到由对手送来的“礼物”"+SHIELD_UNLOCK_CONDITION+"次后解锁本道具。"
            },
            shrink:{
                name:"缩小",
                desc:"缩小对手的牌、筹码、道具，持续10秒。"
            },
            spy:{
                name:"间谍",
                desc:"对手亮出手牌，持续10秒。"
            },
            slow:{
                name:"慢进",
                desc:"自己的牌、筹码、道具运动速度减慢，持续10秒"
            },
            sniper:{
                name:"狙击",
                desc:"消灭对手场上最大的牌，如果对手场上没有牌时则无效。"
            },
            thief:{
                name:"小偷",
                desc:"放出一个化装成筹码的小偷，如果进入对手的金库，可以偷走对手一些钱（数量受当前赔率影响）。",
                unlock: "得到总价$"+THIEF_UNLOCK_CONDITION +"的筹码后解锁本道具。"
            },
            tornado:{
                name:"旋风",
                desc:"在对手面前放出很多旋风，干扰对手拿牌。"
            },
            two:{
                name:"2",
                desc:"召唤一张无花色的2朝对手移动。",
                unlock: "玩总共"+TWO_UNLOCK_CONDITION+"次游戏后解锁本道具。"
            },
            upward:{
                name:"赔率上升",
                desc:"本轮赔率随机上升1～4。\n多个本道具的效果不会叠加，而是覆盖之前的数值。",
                unlock: "赔率达到"+UPWARD_UNLOCK_CONDITION+"后解锁本道具。"
            },
            vase:{
                name:"脆弱的花瓶",
                desc:"在对手区域出现两只花瓶。\n不小心打碎它们的人得照价赔偿。",
                unlock: "游戏总时长超过"+VASE_UNLOCK_CONDITION+"分钟后解锁本道具。"
            }
        }
    },
    en:{
        win:"WIN",
        lose:"LOSE",
        tie:"TIE",
        handTypeDisplayName: {
            "five-of-a-kind": "5 of a kind",
            "straight-flush": "Straight Flush",
            "four-of-a-kind": "4 of a kind",
            "full-house": "Full House",
            "flush": "Flush",
            "straight": "Straight",
            "three-of-a-kind": "3 of a kind",
            "two-pair": "Two Pairs",
            "one-pair": "One Pair",
            "high-card": "High Card",
            "no-card": "No Card"
        },

        letMeSee: "Let me see",
        player1 : "Player↓",
        player2 : "Player↑",
        player: "Player",
        aiPlayer: "AI↑",
        aiLevel: ["easy AI","normal AI","hard AI","mad AI"],
        deck: "Using Deck",
        token: "Flying Token",
        item: "Flying Item",
        none: "none",
        few: "few",
        normal: "normal",
        many: "many",
        mania: "mania",

        language: "Language",
        followSystem:"System",
        enLang:"English",
        zhLang:"简体中文",
        clearData:"Clear Data",

        startGame: "Start Game",
        useDefault: "Default",
        returnToIntro: "Back",

        gameOver: "GAME OVER",

        tutorials: {
            touchThisCard: "Touch this card please.",
            showYourCard: "You got you first card.\nCheck you hands by long press this area.\nDon't let opponent peek your cards ;)",
            collectYourCard:"Keep collecting cards.\nForm your cards to a Poker Hand.\nWin opponent's money by beat his hands.",
            thisIsYourMoney: "This is your money.\nIf your money is gone, you lose!",
            thisIsYourTarget: "This is your victory goal.\nIf your money reach this goal \nafter winning a round,you win the game!",
            thisIsForbidLine: "This is a forbid line for iOS Browser.\nPlease don't swipe from this area.\nOr the game will be closed!",
            thisIsCountDown:"When any player get their fifth card.\nThe other player only has 5 seconds left.",
            compareHands: "When count down finish,\nBoth players' hands are revealed\nand compared in simplified POKER rule.\nStronger Poker category win this round.",
            compareHands2: "If they are in same category,\ncompare number of highest card's number\nthat form the Poker Hand.\n(e.g.:Card that form triple in Full House.)",
            compareHands3: "If there is still a tie,\ntwo player tie this round.\nNo need to compare suit or other cards.",
            betHelp:"Winner get money from loser.\nMoney amount equal to total of\nboth players hands' gambit,\nmultiplied by current bet rate.",
            handHelp: "Click this button to checkout\nall Poker Hand and their gambit.",
            betRateIncrease: "Bet rate increase 1 per round.",

            modeSelectIntro: "You can customize your game here.",
            selectInitMoney: "You can adjust initial money\nfor both players.",
            selectTargetMoney: "You can adjust target money\nfor both players.",
            selectDeck: "You can decide which deck\nwill be use in game:\neither 8～A(28 cards totally)\nor 2～A(52 cards totally).",
            selectToken: "You can adjust tokens' rate of appearance.",
            selectItem: "You can adjust items' rate of appearance.",
            selectEachItem: "You can switch each item on or off.",
            changeAI: "You can change AI difficulty here."
        },

        items: {
            unknown: "UNKNOWN",
            charge_before: "(",
            charge_after: " charges)",
            on: "ON",
            off: "OFF",
            locked: "LOCKED",

            "unused":"Use this item at least once, then you can switch it on or off in game options.",
            "ace":{
                name:"ACE",
                desc:"Send an ace card which has no suit move toward you.",
                unlock: "Defeat AI(normal or above) "+ACE_UNLOCK_CONDITION+" times in fair game to unlock this item."
            },
            bomb:{
                name:"BOMB",
                desc:"Send a bomb toward opponent.If it reach player's hand, bomb will randomly destroy one of his card.(If player's hand is full, bomb has no effect) Watch out!It can be send back."
            },
            cloud:{
                name:"CLOUD",
                desc:"Summon many clouds to disturb opponent's sight."
            },
            diamond:{
                name:"DIAMOND",
                desc:"Attract all Q cards toward you."
            },
            dizzy:{
                name:"DIZZY",
                desc:"All opponent's cards,tokens and items will rotate repeatedly for 10 seconds."
            },
            downward:{
                name:"DECREASE BET RATE",
                desc:"Decrease bet rate of this round by 1～4(not less than 1).\n(Multiply items' effect will not be accumulated.)",
                unlock: "Bet rate reach "+DOWNWARD_UNLOCK_CONDITION+" to unlock this item."
            },
            enlarge:{
                name:"ENLARGE",
                desc:"Enlarge all your cards,tokens and items for 10 seconds.",
                unlock: "PvP "+ENLARGE_UNLOCK_CONDITION+" times to unlock this item."
            },
            fast:{
                name:"FAST FORWARD",
                desc:"All opponent's cards,tokens and items move faster for 10 seconds."
            },
            forbid:{
                name:"Forbid",
                desc:"Opponent cant use item or get item for 10 seconds.",
                unlock: "use item "+FORBID_UNLOCK_CONDITION+" times to unlock this item."
            },
            hammer:{
                name:"HAMMER OF GOD",
                desc:"Summon a hammer toward opponent.It will destroy anything it hit and blow away everything in opponent's field.",
                unlock: "Get five-of-a-kind "+HAMMER_UNLOCK_CONDITION+" time to unlock this item."
            },
            "katana":{
                name:"SWORD",
                desc:"Slash cards or tokens in opponent's middle area.",
                unlock: "Defeat AI(hard or above) "+KATANA_UNLOCK_CONDITION+" times in fair game to unlock this item."
            },
            kiss:{
                name:"KISS",
                desc:"Attract all K cards and J cards toward you.",
                unlock: "PvP "+KISS_UNLOCK_CONDITION+" times to unlock this item."
            },
            leaf:{
                name:"FALLING LEAVES",
                desc:"Summon many falling leaves to disturb opponent's sight.",
                unlock: "Get straight-flush "+LEAF_UNLOCK_CONDITION+" time to unlock this item."
            },
            magnet:{
                name:"TOKEN MAGNET",
                desc:"Attract all tokens toward you(including fake one).",
                unlock: "Get token "+MAGNET_UNLOCK_CONDITION+" times to unlock this item."
            },
            nuke:{
                name:"NUKE",
                desc:"Destroy all cards and tokens and all players' hands.Count down will also be cancelled.",
                unlock: "Destroy "+NUKE_UNLOCK_CONDITION+" cards to unlock this item."
            },
            shield:{
                name:"SHIELD",
                desc:"Bounce back everything sent by opponent for 10 seconds.",
                unlock: "Get "+SHIELD_UNLOCK_CONDITION+" \"gifts\" sent by opponent to unlock this item."
            },
            shrink:{
                name:"SHRINK",
                desc:"Shrink all opponent's cards,tokens and items for 10 seconds."
            },
            spy:{
                name:"SPY",
                desc:"Opponent show you their hand for 10 seconds."
            },
            slow:{
                name:"SLOW FORWARD",
                desc:"All your cards,tokens and items move slowly for 10 seconds."
            },
            sniper:{
                name:"SNIPER",
                desc:"Destroy highest card in opponent's field.(If there is no card in opponent's field, nothing happened)"
            },
            thief:{
                name:"THIEF",
                desc:"Summon a thief who disguised as a token move toward opponent.If thief enter player's hand, he will steal money from him.(Money amount if effected by current bet rate)",
                unlock: "Get totally $"+THIEF_UNLOCK_CONDITION +" tokens to unlock this item."
            },
            tornado:{
                name:"TORNADO",
                desc:"Summon many tornadoes in opponent's field which will disturb they taking card or token."
            },
            two:{
                name:"2",
                desc:"Send a 2 card which has no suit move toward opponent.",
                unlock: "Play "+TWO_UNLOCK_CONDITION+" games to unlock this item."
            },
            upward:{
                name:"INCREASE BET RATE",
                desc:"Increase bet rate of this round by 1～4.\n(Multiply items' effect will not be accumulated.)",
                unlock: "Bet rate reach "+UPWARD_UNLOCK_CONDITION+" to unlock this item."
            },
            vase:{
                name:"MING VASE",
                desc:"Two vases appear in opponent's area.\nBreaking them will cost player's money.",
                unlock: "Accumulate total game time over "+VASE_UNLOCK_CONDITION+" minutes to unlock this item."
            }
        }
    }
};
