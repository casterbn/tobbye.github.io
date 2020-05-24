
var Task = {};

Task.cfg = {
    idx: 0,
    ladd: 0,
    logFail:'<h4>任务#idx失败</h4>请重置后再次尝试!',
    logStop:'<h4>任务#idx中止</h4>请打开#pack',
    logNext:'<h4>任务#idx完成</h4>请进行下一任务',
    logOpen:'<h4>任务全部完成</h4>您可以打开#pack啦!',
    logText:'logText',
};

Task.creatTask = function(block, mix) {
    document.block = block;
    let data = document.body.data;
    let line = document.body.line;
    Task.taskType = data.taskType[Task.cfg.idx];
    config.sett.taskType = Task.taskType;
    config.taskData = Task.cfg;
    switch (Task.taskType) {

        case 'snake':
            Task.creatSnake(block, line.word);
            break;
        case 'puzzle': 
            Task.creatPuzzle(block, line.word);
            break;
        case 'jigsaw':
            Task.creatJigsaw(block, line.src, line.idx);
            break;
        case 'labyrinth':
            Task.creatLabyrinth(block, line.word);
            break;
        }

    if (!mix) {
        Elem.get('btn-redo').onclick = function() {
            Task.mixAnim();
        }
        Task.initTask();
        Task.checkAction('redo');
        console.log(Task);
    }
}

Task.mixAnim = function(block) {
    var clock = config.clock;
    clearInterval(clock.mixClock);
    clock.mixLoop = config.constant.clock.mixLoop;
    clock.mixClock = setInterval(function() {
        block = block || document.block;
        if (clock.mixLoop > 0) {
            if (Task.game.mixAnim) {
                Task.game.mixAnim();
            } else {
                block.innerHTML = '';
                Task.game.isLoop = false;
                Task.creatTask(block, true);
            }
            clock.mixLoop--;
        } else {
            clearInterval(clock.mixClock);
            clock.mixLoop = config.constant.clock.mixLoop;
        }
    }, 120);  
    if (!Task.game.mixAnim) {
        Task.initTask();
        console.log(Task); 
    }
}


Task.initTask = function() {
    Task.cfg.type = Task.cfg.types[Task.cfg.idx];
    Task.cfg.ladd = Task.cfg.idx + 1;
    Task.cfg.title = Task.game.title.replace('#idx', Task.cfg.ladd);
    Task.cfg.logText = Task.game.logText.replace('#pack', Task.cfg.pack);
    Task.cfg.orgTips = Task.game.orgTips.replace('#pack', Task.cfg.pack); 
    Task.cfg.tgtTips = Task.game.tgtTips.replace('#pack', Task.cfg.pack);
    Elem.get('task-title').innerHTML = Task.cfg.title;
}

Task.checkState = function(state) {
    Task.cfg.state = state;
    if (state == 'stop') {
        if (Task.cfg.idx > 1)
            Task.checkAction('stop');
        else
            Task.checkAction('fail');
    } else {
        if (Task.cfg.idx < Task.cfg.types.length) {
            Task.initTask();  
            Task.checkAction('next');
        } else {
            Task.checkAction('open');
        }
        Task.cfg.idx++;
    }
}

Task.checkAction = function(action) {
    Task.cfg.action = action;
    Style.display('btn-open', 'none');
    Style.display('btn-next', 'none');
    Style.display('btn-redo', 'none');
    Style.display('btn-abon', 'none'); 
    if (action == 'open') {
        Task.logFade(Task.cfg.logOpen);
        Style.display('btn-open', 'inline');
    }
    if (action == 'next') {
        Task.logFade(Task.cfg.logNext);
        Style.display('btn-next', 'inline');
     }
    if (action == 'redo') {
        Task.logFade(Task.cfg.logText);
        Style.display('btn-redo', 'inline');
        Style.display('btn-abon', 'inline');
    }
    if (action == 'stop') {
        Task.logFade(Task.cfg.logStop);
        Style.display('btn-open', 'inline');
    }
    if (action == 'fail') {
        Task.logFade(Task.cfg.logFail);
        Style.display('btn-redo', 'inline');
        Style.display('btn-abon', 'inline');
    }

    if (action == 'redo' || action == 'fail' && Task.game.isArrow) { 
        Style.display('btn-up', 'inline');
        Style.display('btn-down', 'inline');
        Style.display('btn-left', 'inline');
        Style.display('btn-right', 'inline');
    } else {
        Style.display('btn-up', 'none');
        Style.display('btn-down', 'none');
        Style.display('btn-left', 'none');
        Style.display('btn-right', 'none');
    }
}


Task.logFade = function(log) {
    Task.cfg.logFade = log.replace('#idx', Task.cfg.ladd).replace('#pack', Task.cfg.pack);
    showLog(Task.cfg.logFade);
}

Task.logAlert = function(log) {
    setTimeout(function() {alert(log)}, 200);
}


Task.setTouch = function(btn) {
    if (!Task.game) return;
    if (!Task.game.control) return;
    let list = Task.game.arrowList;
    for (let i in list) {
        Elem.get('btn-' + list[i]).onclick = function() {
            let idx = list.indexOf(this.id.split('-')[1]);
            Task.game.control(idx);
        }
    }
};

document.onkeydown = function(evt) { 
    if (!Task.game) return;
    if (!Task.game.control) return;
    let idx = evt.keyCode - 37;
    Task.game.control(idx);
};











