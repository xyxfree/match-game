//------------------数据------------------------
data = [
    { id: 0, name: 'github', matchId: 1 },
    { id: 1, name: 'github', matchId: 1 },
    { id: 2, name: 'internet-explorer', matchId: 2 },
    { id: 3, name: 'internet-explorer', matchId: 2 },
    { id: 4, name: 'steam', matchId: 3 },
    { id: 5, name: 'steam', matchId: 3 },
    { id: 6, name: 'twitter', matchId: 4 },
    { id: 7, name: 'twitter', matchId: 4 },
    { id: 8, name: 'windows', matchId: 5 },
    { id: 9, name: 'windows', matchId: 5 },
    { id: 10, name: 'google', matchId: 6 },
    { id: 11, name: 'google', matchId: 6 },
    { id: 12, name: 'firefox', matchId: 7 },
    { id: 13, name: 'firefox', matchId: 7 },
    { id: 14, name: 'chrome', matchId: 8 },
    { id: 15, name: 'chrome', matchId: 8 },
    { id: 16, name: 'facebook-square', matchId: 9 },
    { id: 17, name: 'facebook-square', matchId: 9 },
    { id: 18, name: 'youtube-play', matchId: 10 },
    { id: 19, name: 'youtube-play', matchId: 10 }
];
//-------------------------全局变量----------------------------------
global = {
    listCon: document.querySelector('.list-con'),
    prompt: document.querySelector('.prompt'),
    judgeArr: [],
    time: {
        h: 0,
        m: 0,
        s: 0,
        t: 0,
        timer: null
    },
    correct: false,
    wrongStep: 0,
    totleStep: 0,
    starsNum: 0,
    pixel: 1 / window.devicePixelRatio,
    first: true
};

//-----------------------------生成节点--------------------------------------
function createLiNode(dataItem) {
    const item = document.createElement('li');
    item.matchId = dataItem.matchId;
    item.elementId = dataItem.id;
    item.correct = false;
    const str = `
	    <div class="card flipper-container">
	      <div class="flipper">
	  	<div class="front">
	  	</div>
	  	<div class="back">
	  	  <i class="fa fa-${dataItem.name}" aria-hidden="true"></i>
	  	</div>
	      </div>
	    </div>
	  `;
    item.innerHTML = str;

    return item;
}
//---------------------------生成结构------------------------------------------------------
function createCards(data) {
    global.listCon.innerHTML = '';
    const arr = data.slice().sort(function() {
        return Math.random() - 0.5;
    });
    arr.forEach(function(item) {
        global.listCon.appendChild(createLiNode(item));
    });
}

// createCards(data);

//--------------------------点击翻转函数--------------------------------------------------------------
function rotate() {
    const listCon = document.querySelector('.list-con');
    const items = listCon.querySelectorAll('li');

    [...items].forEach(function(item) {
        decide(item);
    });
};

// rotate();
//---------------------------判断是否匹配正确----------------------------------------------------

function decide(item) {
    const flipper = item.querySelector('.flipper');
    item.onclick = function() {
        flipper.className = 'flipper active';
        if (!item.correct) {
            global.judgeArr.push(item);
            if (global.judgeArr.length == 2) {
                //不能匹配自己
                if (global.judgeArr[0].elementId === global.judgeArr[1].elementId) {
                    global.judgeArr.length = 1;
                } else if (global.judgeArr[0].matchId !== global.judgeArr[1].matchId) {
                    //匹配失败
                    judge(global.judgeArr, false);
                    global.judgeArr.length = 0;
                    global.wrongStep++;
                } else {
                    //匹配成功
                    global.judgeArr.forEach(item => item.correct = true);
                    judge(global.judgeArr, true);
                    global.judgeArr.length = 0;
                }
                global.totleStep++;
                stars();
                prompt();
            }
        }
    };
}

//------------------------提示是否匹配正确-------------------------------
function judge(arr, onOff) {
    global.judgeArr.forEach(function(item) {
        const flipper = item.querySelector('.flipper');
        if (!onOff) {
            setTimeout(function() {
                flipper.className = 'flipper wrong';
            }, 1000);

        } else {
            setTimeout(function() {
                flipper.className = 'flipper correct';
            }, 1000);
        }
    });
}
//--------------------------计时器------------------------------------------
function timing() {
    global.time.h = parseInt(global.time.t / 60 / 60);
    global.time.m = parseInt(global.time.t / 60 % 60);
    global.time.s = parseInt(global.time.t % 60);

    const hours = document.querySelector('.hours');
    const minutes = document.querySelector('.minutes');
    const seconds = document.querySelector('.seconds');

    hours.innerHTML = global.time.h ? global.time.h : '';
    minutes.innerHTML = add0(global.time.m);
    seconds.innerHTML = add0(global.time.s);

    global.time.t++;

    global.time.timer = setTimeout(timing, 1000);
}

function add0(num) {
    return num < 10 ? '0' + num : '' + num;
}
// timing();

//--------------------------星星-------------------------------
function stars() {
    const star = document.querySelectorAll('.fa-star');
    const starsArr = [...star];
    let arr = starsArr.slice();
    if (global.wrongStep <= 8) {
        arr.length = 0;
        global.starsNum = 3;
    } else if (global.wrongStep > 8 && global.wrongStep <= 16) {
        arr = arr.slice(2, 3);
        global.starsNum = 2;
    } else {
        arr.shift();
        global.starsNum = 1;
    }
    arr.forEach(item => item.className = 'fa fa-star-o');
}
//----------------------------提示框---------------------------------
function prompt() {
    // global.prompt.classList.toggle('show',correct);
    const listCon = document.querySelector('.list-con');
    const items = listCon.querySelectorAll('li');
    const getStar = global.prompt.querySelector('.get-star em');
    const total = global.prompt.querySelector('.total-step em');
    const totalTime = global.prompt.querySelector('.total-time em');
    const time = document.querySelector('.info time');

    global.correct = [...items].every(function(item) {
        return item.correct;
    });
    console.log(global.correct);
    total.innerHTML = global.totleStep;
    getStar.innerHTML = global.starsNum;
    global.prompt.classList.toggle('show', global.correct);
    totalTime.innerHTML = time.innerHTML;
    if (global.correct) {
        clearTimeout(global.time.timer);
        again(global.correct, data);
    }

}
//----------------------------初始化--------------------------------
function gameInit(data) {
    createCards(data);
    rotate();
    global.wrongStep = 0;
    global.totleStep = 0;
    global.starsNum = 0;
    global.time = {
        h: 0,
        m: 0,
        s: 0,
        t: 0,
        timer: ''
    };
    global.correct = false;
    global.prompt.classList.remove('show');
    const star = document.querySelector('.star');
    const starsAll = star.querySelectorAll('.fa');
    [...starsAll].forEach(function(item) {
        console.log(item);
        item.className = 'fa fa-star';
    });
    global.judgeArr = [];
}

//-------------------------------再来一次---------------------------------
function again(correct, data) {
    const btnAgain = document.querySelector('.once-more');

    btnAgain.onclick = function() {
        gameInit(data);
        timing();
    };
}
//-------------------------------移动端适配---------------------------
function adopt() {
    const head = document.querySelector('head');
    const scale = document.createElement('meta');

    scale.name = 'viewport';
    scale.content = `width=device-width,initial-scale=${global.pixel},minimum-scale=${global.pixel},maximum-scale=${global.pixel},user-scalable=no`;
}
//--------------------------------开始按钮-------------------------------------

function startBtn() {
    const startBtn = document.querySelector('.start-game');
    startBtn.onclick = function() {
        const shadow = document.querySelector('.shadow');
        clearTimeout(global.time.timer);
        shadow.style.opacity = 0;
        shadow.style.top = '-100 %';
        setTimeout(function() {
            shadow.style.display = 'none';
        }, 500);
        global.first = false;
        gameInit(data);
        timing();
        startBtn.innerHTML = global.first ? '开始游戏' : '重新开始';
    };
    startBtn.onmousedown = function() {
        this.classList.add('active');
    };
    startBtn.onmouseup = function() {
        this.classList.remove('active');
    };
}

adopt();
gameInit(data);
startBtn();