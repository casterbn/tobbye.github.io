
window.onresize = function() {
    Config.page = new Page();
}



var Panel = function() {
    this.init = function(panel, name) {
        this.name  = name;
        this.panel = panel;
        this.offset = panel.getAttribute('offset') || 0;
        this.title = panel.querySelector('.alert-title');
        this.block = panel.querySelector('.alert-block');
        this.buttons = panel.querySelectorAll('.button');
        if (!this.title || !this.block) 
            return;
        if (name == 'edit') {
            this.input = panel.querySelector('.alert-input');
            this.limit = panel.querySelector('.alert-limit');
        }
        if (/chat|task/i.test(name)) {
            this.input = panel.querySelector('textarea');
        }
        Alert.panels[name] = this;
    }
}


var Alert = new __Alert();

function __Alert() {
//初始化Alert
    this.init = function() {
        this.name = 'Alert';
        this.initAlert();
        this.btnClick('btn-quit', this.hidePanel);
        this.btnClick('btn-abon', this.hidePanel);
        this.btnClick('btn-close', this.hidePanel);
        this.hidePanel();
        Container(this);
    }


    this.creatTitle = function(content, data, len, y) {
        let flex   = Elem.creat('div', content, 'flex');
        let left   = Elem.creat('div', flex, 'guide', 'L');
        let center = Elem.creat('div', flex, 'guide', 'C');
        let right  = Elem.creat('div', flex, 'guide', 'R');
        if (data.title) {
            let title = Elem.creat('div', center, 'title');
            title.innerHTML = data.title;
        }

        if (data.vice) {
            let vice = Elem.creat('div', center, 'vice');
            vice.innerHTML = data.viceStr || data.vice;
        }

        if (len > 1 && cfg.name == 'nexu' || cfg.name == 'rank') {
            if (y > 0) {
                let guide   = Elem.creat('div', left, 'button-min');
                guide.style.border = 'solid 6px ' + Alert.colorFont();
                guide.style.color = Alert.colorFont();
                guide.innerHTML = '↑';
                guide.onclick = function() {
                    let tgt = this.parentNode.parentNode.parentNode.previousSibling;
                    console.log(tgt);
                    tgt.scrollIntoView();
                }
            }
            if (y < len-1) {
                let guide   = Elem.creat('div', right, 'button-min');
                guide.style.border = 'solid 6px ' + Alert.colorFont();
                guide.style.color = Alert.colorFont();
                guide.innerHTML = '↓';
                guide.onclick = function() {
                    let tgt = this.parentNode.parentNode.parentNode.nextSibling;
                    console.log(tgt);
                    tgt.scrollIntoView();
                }
            }
        }
    }

    this.creatLink = function(outer, href) {
        for (let x in href) {
            let data = href[x];
            let link = Elem.creat('a', outer, 'button-bot');
            link.innerHTML = data.text;
            link.href = data.href;
            if (cfg.name == data.name) 
                link.setAttribute('state', 'liveLink');
            else
                link.setAttribute('state', 'deadLink');
        }
    }


    this.creatOuterTop = function(that) {
        let outer = Elem.get('outer-top');
        if (items.length < 2) {
            this.creatLink(outer, Constant.hrefTop);
            return;
        }
        for (let x in items) {
            let btn = Elem.creat('div', outer, 'button-top');
            btn.innerHTML = items[x].title;
            btn.idx = x;
            btn.onclick = function() {
                Alert.showInner(this.idx);
            }
        }
    }

    this.creatOuterCenter = function(that) {
        window.onresize();
        let outer = Elem.get('outer-center');
        outer.innerHTML = '';
        for (let x in items) {
            let inner = Elem.creat('div', outer, 'inner', 'items['+x+'].');
            let list = items[x].list;
            for (let y in list) {
                let content = Elem.creat('div', inner, 'content', 'list['+y+'].');
                let data = list[y];
                if (that.setTitle)
                    that.setTitle(content, data);
                this.creatTitle(content, data, list.length, y);
                that.creatBlock(content, data, x, y);
            }
        }
    }

    this.creatOuterBot = function(that) {
        let outer = Elem.get('outer-bot');
        this.creatLink(outer, Constant.hrefBot);
    }

    this.creatContent = function(that, x, y) {
        let outer = Elem.get('outer-center');
        let inner = outer.children[x];
        let content = inner.children[y];
        let data = items[x].list[y];
        content.innerHTML = '';
        if (that.setTitle)
            that.setTitle(content, data);
        this.creatTitle(content, data, 3, y);
        that.creatBlock(content, data, x, y);
    }

    //显示内页
    this.showInner = function(clickIdx) {
        let idx = Config.sett.isInto ? Config.innerIdx : clickIdx || 0;
        let outerTop = document.querySelectorAll('.button-top');
        let outerCenter = document.querySelectorAll('.inner');
        let isPage = Config.sett.colorType == 'page';
        for (let i = 0; i < outerTop.length; i++) {
            let childTop = outerTop[i];
            let childCenter = outerCenter[i];
            if (childTop.className != 'button-top')
                break;
            if (i == idx) {
                if (isPage) 
                    Elem.color(childTop, Alert.colorBgd(), Alert.colorFont());
                else
                    Elem.attr(childTop, 'state', 'live');
                Elem.show(childCenter);
            } else {
                if (isPage)
                    Elem.color(childTop, Alert.colorFont(), Alert.colorBgd());
                else
                    Elem.attr(childTop, 'state', 'dead');
                Elem.show(childCenter, 'none');
            }
        }
        Config.sett.isInto = Config.innerIdx != clickIdx;
        Config.innerIdx = idx;
        Alert.setInner(clickIdx, idx);
    }

    this.setInner = function(clickIdx, idx) {
        let isText = Config.sett.colorType == 'text';
        if (isText)
            Elem.color(document.body, Alert.colorFont(), '');
        else
            Elem.color(document.body, Alert.colorFont(), Alert.colorBgd());
        if (Config.sett.isInto || clickIdx == null || Config.sett.debugType == 'close') {
            Config.sett.isInto = false;
            Storage.set('Config', Config);
        } else if (Config.sett.debugType != 'close') {
            Config.sett.isInto = true;
            Storage.set('Config', Config);
            jsonToTable(items[idx]); 
        }
    }




    this.initAlert = function() {
        this.panels = {};
        this.buttons = {};
        this.alert = document.querySelector('#alert');
        this.box = document.querySelector('#alert-box');
        let buttons = document.querySelectorAll('.button');
            for (let i=0; i<buttons.length; i++) {
            let name = buttons[i].getAttribute('name');
            this.buttons[name] = buttons[i];
        }
        if (!this.alert || !this.box) return;
        let panels = this.box.querySelectorAll('.alert-panel');
        for (let i=0; i<panels.length; i++) {
            let name = panels[i].getAttribute('name');
            let panel = new Panel();
            panel.init(panels[i], name);
        }
    }



    this.showButton = function(nexu) {
        let nexus = [[4,5], [0,1,3], [0,2,3], [0,3]][nexu];
        let buttons = this.curPanel.buttons;
        if (nexus) {
            for (var i=0;i<buttons.length;i++) {
                let name = buttons[i].getAttribute('name');
                if (nexus.indexOf(i) > -1)
                    Elem.show(buttons[i]);
                else
                    Elem.hide(buttons[i]);
            } 
        }
    }


    //显示弹窗
    this.showPanel = function(name, save) {
        if (this.curPanel) {
            Elem.hide(this.curPanel.panel);
            this.backName = this.curPanel.name;
        }
        this.curPanel = this.panels[name];
        if (!this.curPanel) return;
        this.setBox();
        this.isAlert = true;
        // console.log(this.curPanel);

        Elem.show(this.alert);
        Elem.show(this.curPanel.panel);
        if (!save)
            Elem.text(this.curPanel.block, '');
    }


    //隐藏弹窗
    this.hidePanel = function(name) {
        this.isAlert = false;
        this.backName = null;
        Elem.hide(this.alert);
        if (!this.alert || !this.box) return;
        for (var i=0; i<this.box.children.length; i++) {
            let panel = this.box.children[i];
            Elem.hide(panel);
        }
        if (cfg.name == 'tran')
            Task.clear();
    }

    this.backPanel = function() {
        console.log(this.curPanel);
        Elem.hide(this.curPanel.panel);
        if (this.backName)
            this.showPanel(this.backName, 1);
    }


    this.prefix = ' ------------------------------- ';
    this.suffix = ' ------------------------------- ';

    this.log = function(text) {
        Config.fade.setAnim(text);
    }

    this.print = function(text) {
        console.log(text);
    }

    this.printName = function(name) {
        console.log(this.prefix + name + this.suffix);
    }


    this.setBox = function() {
        Elem.color(this.box, '', Alert.colorLight());
        Elem.maxheight(this.curPanel.block, Config.page.alertHeight-this.curPanel.offset);
    }


    this.btnClick = function(name, func) {
        if (Elem.get(name)) {
            Elem.get(name).onclick = function() {
                func();
            }
        }
    }

    this.btnState = function(name, state) {
        if (Elem.get(name)) {
            Elem.get(name).setAttribute('state', state);
        }
    }


    this.UserData = function() {

        this.init = function(line) {
            this.uid = line.uid || line.sid;
            Config.getObject(this, line);
            Config.getObject(this, Config.__user(this.uid));
            this.initTemp();
            this.nexu = this.nexu || line.nexu;
 
        }



        this.initTemp = function() {
            this.group = this.group || Config.getGroup(this);
            this.order = this.order || Config.getOrder(this.ord);
            this.value = this.value || (this.valStr + ': ' + Parse.sub4Num(this.val));
            this.desc = '<div desc="center">' + this.name + '的描述</div>';
        }
    }

    this.UserFlex = function() {

        this.init = function(body, line, isHead) {
            cfg.isHead = cfg.isRank || isHead;
            this.body = body;
            this.initHead(line);
            this.initBody(line);
        }

        this.initHead = function(line) {
            if (cfg.isHead) {
                this.top = Elem.creat('div', this.body, 'user-top');
                this.order = Elem.creat('div', this.top, 'user-order');
                this.value = Elem.creat('div', this.top, 'user-value');

                this.order.innerHTML = line.order;
                this.value.innerHTML = line.value; 
                Elem.color(this.order, '', Alert.colorFont());
            } 
        }

        this.initBody = function(line) {
            this.marks = [];
            this.flex = Elem.creat('div', this.body, 'user-flex');
            this.icon = Elem.creat('img',  this.flex, 'user-icon');
            this.left = Elem.creat('div',  this.flex, 'user-left');
            this.right = Elem.creat('div',  this.flex, 'user-right');
            this.name = Elem.creat('div',  this.left, 'user-name');
            this.mark = Elem.creat('div',  this.left, 'user-flex');
            this.ladd = Elem.creat('div',  this.right, 'user-ladd');
            this.group = Elem.creat('div',  this.right, 'user-group');
            for (let i in line.mark) {
                let mark = Elem.creat('div', this.mark, 'user-mark');
                mark.innerHTML = line.mark[i];
                mark.style.borderColor = Alert.colorFont();
                this.marks[i] = mark;
            }
            this.icon.style.backgroundColor = Alert.colorFont();
            this.group.style.borderColor = Alert.colorFont();
            if (line.isSponer)
            Elem.color(this.group, 'white', Alert.colorFont());

            this.name.innerHTML = line.name || line.inver;
            this.ladd.innerHTML = (line.ladder || line.ladd || '??') + '阶';
            this.group.innerHTML = line.group || '未知';
            this.flex.setAttribute('margin', 'T5');
            if (Alert.isAlert && Alert.curPanel.name == 'info')
                return;
            let select = cfg.isHead ? this.body:this.flex;
            select.onclick = function() {
                Alert.bodySelect(this);
                Alert.showUser(this);
            } 
        }
    }

    this.UserBody = function() {

        this.init = function(block, line) {
            this.tags = [];
            this.body = Elem.creat('div', block, 'user-body');
            this.flex = new Alert.UserFlex();
            this.flex.init(this.body, line);
            this.tag = Elem.creat('div', this.body, 'user-tags');
            this.desc = Elem.creat('div', this.body, 'user-desc');
            if (line.tag) {
                for (let i in line.tag) {
                    let tag = Elem.creat('div', this.tag, 'user-tag');
                    tag.style.backgroundColor = Alert.colorFont();
                    tag.innerHTML = line.tag[i];
                    tag.onclick = function() {
                        Alert.showSearch(this);
                    }
                    this.tags[i] = tag;
                }
            }
            this.desc.innerHTML = line.desc.replace(/\n/g, '<br/>');
            this.desc.innerHTML += 'THE DESCRIBE OF ' + line.name + '<br/>';
            this.desc.innerHTML += 'THE DESCRIBE OF ' + line.name + '<br/>';
            this.desc.innerHTML += 'THE DESCRIBE OF ' + line.name + '<br/>';
        }
    }



    this.bodySelect = function(flex) { 
        if (Alert.curPanel) return;
        let old = document.body.flex;
        if (old) {
            old.setAttribute('select', 'not');
        }
        if (flex) {
            flex.setAttribute('select', 'yes');
            document.body.flex = flex; 
        }
    }



    this.showUser = function(flex, isSponer) {
        this.hidePanel();
        this.showPanel('info');
        flex = flex || document.body.flex;
        let x = flex.x;
        let data = Config.__list(flex);
        let temp = Config.__line(flex);
        let title = this.curPanel.title;
        let block = this.curPanel.block;
        let line = new this.UserData();
        line.init(temp);
        let user = isSponer ? temp.__sponer : temp.__digger;
        user = user || line;
        console.log(user)
        let body = new this.UserBody();
        body.init(block, user);
        title.innerHTML = user.group + '资料';
        this.showButton(user.nexu);
        this.print([user.name, user, body]);
    }

    this.showSearch = function(button) {
        this.hidePanel();
        this.showPanel("search");
        let title = this.curPanel.title;
        let block = this.curPanel.block;
        title.innerHTML = Constant.string.titleSearch.replace("#0", button.innerHTML);
        let names = Parse.mix(Array.from(tempData.searchCfg.name));
        let ladds = Parse.mix(Array.from(tempData.searchCfg.ladd));
        let marks = Parse.mix(Array.from(tempData.searchCfg.mark));
        let tags = Parse.mix(Array.from(tempData.searchCfg.tag));
        for (let z in names) {
            let temp = {
                ord: z,
                name: Parse.pick(names, 6),
                ladd: Parse.pick(ladds, 1),
                val: Math.floor((Math.random()+40-z) * 2e3),
                mark: [Parse.pick(marks, 3), Parse.pick(marks, 3)],
                tag: [Parse.pick(tags, 3), Parse.pick(tags, 3), Parse.pick(tags, 3)],
                nexu: 1,
                valStr: '权值',
            };
            tempData.searchData[z] = temp;
            let body = Elem.creat("div", block, "user-block", 'tempData.searchData['+z+']');
            let line = new Alert.UserData();
            line.init(temp);
            let flex = new Alert.UserFlex();
            flex.init(body, line, true);
        }
        this.log('搜索成功!');
    }

    this.showNexu = function() {
        this.hidePanel();
        let flex = document.body.flex;
        let childs = flex.parentNode.children;
        let line = Config.__line(flex);
        let lines = Config.__list(flex).lines;
        Parse.remove(lines, line);  
        console.log(lines);
        Elem.remove(flex);
        for (let i=0; i<childs.length; i++) {
            childs[i].setAttribute('key', 'lines['+i+']');
        }
    }


    this.showChat = function() {
        this.hidePanel();
        this.showPanel("chat");
        let flex = document.body.flex;
        let line = Config.__line(flex);
        let title = this.curPanel.title;
        let block = this.curPanel.block;
        let input = this.curPanel.input;
        Elem.color(input, Alert.colorLight(), "");
        input.placeholder = "输入内容";
        title.innerHTML = line.name;
        // this.box.style.maxHeight = (Config.page.windHeight - 440) + "px";
        // block.style.maxHeight = (Config.page.windHeight - 703) + "px";
        block.innerHTML = "";
        for (let i in tempData.chatData) {
            let data = tempData.chatData[i];
            let ctype = data.isMine ? "right" : "left";
            this.setChatText(block, ctype, data.text);
        }
        let send = Elem.get("btn-send");
        send.block = block;
        send.onclick = function() {
            Alert.setChatSend();
        }
        
        block.lastChild.scrollIntoView();
    }

    this.setChatSend = function(send){
        let input = this.curPanel.input;
        this.setChatText(send.block, "right", input.value);
        if (input.value != "")
            tempData.chatData.push({
                text: input.value,
                date: Parse.getDate(),
                time: Parse.getTime(),
                isMine: 1,
            });
        Elem.color(input, Alert.colorLight(), "");
        input.placeholder = "输入内容";
        input.value = "";
    }


    this.setChatText = function(block, ctype, value) {
        if (value == "") {
            this.hidePanel();
            return;
        }
        let flex = Elem.creat("div", block, "chat-flex");
        let text = Elem.creat("div", flex, "chat-text");
        Elem.attr(flex, "ctype", ctype);
        Elem.attr(text, "ctype", ctype);
        text.innerHTML = value.replace(/\n/g, "<br/>");
        if (this.getChatLength(value) < 17)
            text.style.wordBreak = "keep-all";
        text.scrollIntoView();
    }

    this.getChatLength = function(value) {
        let len = 0;
        let list = value.split('\n');
        for (let idx in list) {
            if (list[idx].length > len)
                len = list[idx].length;
        }
        return len;
    }


    this.onChatFocus = function() {
        let block = this.curPanel.block;
        let input = this.curPanel.input;
        block.lastChild.scrollIntoView();
        input.style.color = Alert.colorFont();
        input.value = "";

        // Style.height("detail-block", "550px");
    }



    this.colorBgd = function() {
        return Config.color.bgd;
    }

    this.colorFont = function() {
        return Config.color.font;
    }

    this.colorLight = function() {
        return Config.color.light;
    }

}











