
var Instances = {};
var Constrtctors = {};

var Container = function(that) {
    let name = that.name || cfg.name;
    console.log(that);
    Instances[name] = ['Instances'];
    Constrtctors[name] = ['Constrtctors'];
} 

var Page= function() {

    Config.getConst(this, 'page');
    this.isMobile = (/Android|webOS|iPhone|iPod|BlackBerry|MIX/i.test(navigator.userAgent));
    this.isWechat = (/micromessenger|MicroMessenger/i.test(navigator.userAgent));
    this.zoom = this.isMobile ? this.zoomMobile : this.zoomComput;
    this.zoom = this.isWechat ? this.zoomWechat : this.zoom;
    this.windWidth = ~~(window.innerWidth / this.zoom);
    this.windHeight = ~~(window.innerHeight / this.zoom);
    this.alertHeight = this.windHeight - this.alertOffset;
    this.outerHeight = this.windHeight - this.outerOffset;
    this.innerHeight = this.windHeight - this.innerOffset;
    this.flowHeight = Math.max(this.innerHeight, this.minHeight);
    this.alertMargin = this.windWidth - this.alertMaxWidth;
    this.alertMargin = Math.max(this.alertMargin / 2, this.alertMinMargin);
    this.alertWidth = this.windWidth - this.alertMargin * 2 - 36;
    this.isWidth = this.windWidth > this.windHeight;
    this.isFlow = this.innerHeight > this.minHeight;
    let box = Elem.get('alert-box');
    if (box) {
        box.style.left = this.alertMargin + 'px';
        box.style.right = this.alertMargin + 'px';
    }

    document.body.style.zoom = this.zoom;
    let center = Elem.get('outer-center');
    center.style.height = this.outerHeight + 'px';
    center.style.maxHeight = this.outerHeight + 'px';
}

var Constant = {
    agent: {},
    action: {
        ref: '#host/#uid/#act/#idx',
        host:'http://localhost:8888',
        page:'/page/home/home.html',
        router:'/#uid/#act/#idx',
    },
    sett: {
        linkType: 'github',   
        modeType: 'digger',
        colorType: 'text',
        debugType: 'close', 
    },
    fade: {
        isLog: true,
        timeIn: 1000,
        timeOn: 3000,
        timeOut: 1000,
        timeTog: 1000,
    },
    link: {
        html: 'file:///C:/Users/ZHANGJIALIANG/<br/>Documents/GitHub/tobbye.github.io',
        github: 'http://tobbye.github.io',
        local: 'http://localhost:8888',
        http: 'http://tobbye.top',
    },
    page: {
        alertMaxWidth: 1000,
        alertMinMargin: 20,
        alertOffset: 716,
        outerOffset: 220,
        innerOffset: 770, 
        minHeight: 700,
        zoomMobile: 1.00,
        zoomWechat: 1.00,
        zoomComput: 0.40,
    }, 
    color: {
        font: '#333',
        light: '#ccc',
        bgd: '#eee',
        style: 'dark',
        type: 'black',
        text: '深黑',
    },
    clock: {
        loop: 10,
    },
    hrefTop: [
        {name:'sett', href:'../sett/sett.html', text:'设置'},
        {name:'rank', href:'../rank/rank.html', text:'榜单'},
        {name:'stat', href:'../stat/stat.html', text:'记录'},
        {name:'help', href:'../help/help.html', text:'帮助'},
    ],
    hrefBot: [
        {name:'user', href:'../user/user.html', text:'个人'},
        {name:'nexu', href:'../nexu/nexu.html', text:'关系'},
        {name:'home', href:'../home/home.html', text:'主页'},
        {name:'fund', href:'../fund/fund.html', text:'资金'},
        {name:'tran', href:'../tran/tran.html', text:'市场'},
    ],
};

var Config = new __Config();

function __Config() {

//初始化配置
    this.init = function() {
        this.cfg = cfg;
        this.name = 'Config';
        this.fade = new Fade();
        this.action = {};

        this.getTemp();

        this.getLink();
        Container(this);
        window.onresize();
    }

    this.getTemp = function() {
        let temp = Storage.get('Config') || {};
        if (cfg.name == 'sett')
            temp = {};
        if (cfg.name == temp.name && temp.sett.isInto)
            this.innerIdx = temp.innerIdx || 0;
        else
            this.innerIdx = 0;
        this.setConst(temp, 'sett');
        this.setConst(temp, 'color');
        this.setConst(temp, 'clock');
    }

    this.setAction = function(act, idx) {
        let uid = 'i';
        let ref = Constant.action.ref;
        ref = ref.replace('#uid', uid).replace('#act', act).replace('#idx', idx);
        this.action.router = ref.replace('#host', '');
        this.action.ref = ref.replace('#host', Constant.action.host);
        console.log(this.action);
        return this.action.ref;
    }


    this.setConst = function(temp, key) {
        this[key] = temp[key] || Constant[key];
        if (typeof(this[key]) === 'object')
            this[key] = JSON.parse(JSON.stringify(this[key]));
    }

    this.getConst = function(that, key) {
        let defult = Constant[key];
        for (let x in defult) {
            that[x] = defult[x];
        }
    }

    this.getLink = function() {
        let path = window.document.location.href;
        let page = window.document.location.pathname;
        let pos = path.indexOf(page);
        let link = path.substring(0, pos);
        this.action.link = link;
        this.action.page = page;
        this.getLinkType(link);
    }

    this.getLinkType = function(link) {
        for (let key in Constant.link) {
            if (Constant.link[key] == link) {
                this.sett.linkType = key;
                return;
            }
        }
    }
}


let tempData = {
    searchData: [
        {order: 1, val: 948670, uid: 'd110001', name: '李刚猛', ladd: 18, tag: ['自定义标签1', '自定义标签2', '自定义标签3'], mark: ['身份标签1', '身份标签2']},
        {order: 2, val: 690663, uid: 'd110002', name: '张雄壮', ladd: 17, tag: ['自定义标签1', '自定义标签2', '自定义标签3'], mark: ['阶层标签1', '阶层标签2']},
        {order: 3, val: 582830, uid: 'd110004', name: '章威武', ladd: 12, tag: ['自定义标签1', '自定义标签2', '自定义标签3'], mark: ['成就标签1', '成就标签2']},
        {order: 4, val: 699972, uid: 'd110002', name: '王坚强', ladd: 20, tag: ['自定义标签1', '自定义标签2', '自定义标签3'], mark: ['排名标签1', '排名标签2']},
        {order: 5, val: 414480, uid: 'd110005', name: '徐福贵', ladd: 17, tag: ['自定义标签1', '自定义标签2', '自定义标签3'], mark: ['评价标签1', '评价标签2']},
        {order: 6, val: 341222, uid: 's110006', name: '赵铁柱', ladd: 15, tag: ['自定义标签1', '自定义标签2', '自定义标签3'], mark: ['理财专家', '投资顾问']},
        {order: 7, val: 202098, uid: 's110007', name: '赵铁牛', ladd: 15, tag: ['自定义标签1', '自定义标签2', '自定义标签3'], mark: ['理财专家', '投资顾问']},
        {order: 8, val: 182256, uid: 's110008', name: '赵铁蛋', ladd: 15, tag: ['自定义标签1', '自定义标签2', '自定义标签3'], mark: ['理财专家', '投资顾问']},
    ],
    unitData: {
        uid: 'uid001', 
        name: 'The Sponsor', 
        ladd: 17, 
        tag: ['自定义标签1', '自定义标签2', '自定义标签3'], 
        mark: ["身份标签1", "身份标签2"],
        mark2: ["阶层标签1", "阶层标签2"],
        mark3: ["成就标签1", "成就标签2"],
        mark4: ["排名标签1", "排名标签2"],
        mark5: ["评价标签1", "评价标签2"],
        desc: `<h3>谁能告诉我花儿为什么那么红？</h3>花儿为什么这样红？
            为什么这样红？
            哎红得好像，
            红得好像燃烧的火，
            它象征着纯洁的友谊和爱情。
            花儿为什么这样鲜？
            为什么这样鲜？
            哎鲜得使人，
            鲜得使人不忍离去，
            它是用了青春的血液来浇灌。
            哎鲜得使人，
            鲜得使人不忍离去，
            它是用了青春的血液来浇灌。
            哎红得好像，
            红得好像燃烧的火，
            它象征着纯洁的友谊和爱情。`
        // `陈晴晴2009，叶梦梦2009，王嫚嫚2010，胡泱秧2013，邓小丽2016，赵素华2016，黎桂清2017，章威威2018，
        // 崔慧珍2019，鲍青青2019，汤小英2019，张沙沙2019觉得很赞！`,

    },

    chatData: [
    {text:"大佬您好，我有个价值20亿的项目，前无古人后无来者！", time:"11：25", isMine:0},
    {text:"静静的听你装完这个逼。", time:"11：25", isMine:1},
    {text:"如何一块变两块？", time:"11：25", isMine:0},
    {text:`今天一块变两块，
        明天两块变四块，
        后天四块变八块，
        大后天一十六块，
        十天二零四八块，
        一月二十一亿块。`, time:"11：27", isMine:0},
    {text:`方法：
        1).培养一种繁殖周期是1天的生物体
        2).剪下蚂蚁的寻路基因植入此生物体内
        3).剪下蜜蜂的采集基因进行改造
        4).在采集基因上镶嵌3.66毫克黄金（价值1元，金价273/克）
        5).把采集基因植入此生物体内
        6).把此生物体投放到非洲金矿
        7).在31天后把蚁后投放到金矿上
        8).在蚁后的吸引下这些生物体聚集到一起，数一数，有21.47亿个
        9).关键时刻到了，一把火（3000度以上）烧死这么多的生物体
        10).等冷却凝固后，地上一堆黄色金属，称重约7.866吨，价值估算21.47亿元
        如此目标实现！`, time:"11：27", isMine:0},

    {text:`二狗子，你这个项目我很有兴趣，你先去市场调研一下，出个详细的策划案出来，把步骤和细节都罗列出来，最好到非洲金矿实地考察一下。`, time:"11：30", isMine:1},
    {text:`另外PPT也是必不可少的，一定要做的美观一点，你上次那个「母猪如何择优配种」项目就是栽在PPT上，做的像狗屎一样，这次可不能再像上次那样瞎搞了。`, time:"11：30", isMine:1},
    {text:`启动资金的问题你不用担心，我大力支持。加油干！二狗子！`, time:"11：30", isMine:1},
    ],
}
