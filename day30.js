// const holes = document.querySelectorAll('.hole');
const scoreBoard = document.querySelector('.score'); //分數顯示
const moles = [...document.querySelectorAll('.mole')]; //地鼠
// 上面這行等於：
// const moles = document.querySelectorAll('.mole');//地鼠
// moles = [...moles];

// 紀錄地鼠的狀態-proxy
// reduce(累加值,處理中的元素,索引) = 將陣列元素累加至單一值
let status = moles.reduce((prev, current, index) => {
    prev[index] = false; //用資料來控制地鼠，true會加上class讓地鼠出現
    return prev;
}, {});
// console.log(status);

// 分數計算
let clickHandler = e => {
    // 先確定編號，再檢查資料是否正確，如果正確就執行
    if (molesProxy[moles.indexOf(e.target)]) {
        setScore(score + 1); //分數+1
        molesProxy[moles.indexOf(e.target)] = false; //地鼠被點擊後立刻關閉，無法連續點擊
    }
};

// 資料驅動
let molesProxy = new Proxy(status, {
    get(target, key) {
        return target[key];
    },
    set(target, key, value) {
        target[key] = value;
        moles[key].removeEventListener('click', clickHandler); //放這裡是為了防止addEventListener重複兩次
        // true才把功能打開，false就關掉
        if (value) {
            moles[key].addEventListener('click', clickHandler);
            moles[key].classList.add('up');
        } else {
            moles[key].classList.remove('up');
        }
    },
});

let score = 0; //起始分數
let timeUp = true; //遊戲時間控制

// 控制分數的方訊
let setScore = num => {
    score = num; //分數等於傳入的數值
    scoreBoard.textContent = score;
};

// 地鼠出現的方訊
let setMole = (mole, time) => {
    // 狀態設為true
    molesProxy[mole] = true;
    //時間到一半就叫出下一隻地鼠
    setTimeout(() => {
        if (!timeUp) {
            getRandomMole();
        }
    }, time / 2);
    //時間到就設定為false
    setTimeout(() => {
        molesProxy[mole] = false;
    }, time);
};

//隨機出現地鼠的方訊
let getRandomMole = e => {
    // 決定出現第幾隻地鼠
    let mole = Math.floor(Math.random() * moles.length);
    // 決定地鼠出現幾秒，範圍1000-1500
    let time = Math.random() * (1500 - 1000) + 1000; //公式：(大-小)+小

    // 遞迴-如果該mole已經被呼叫過，就重新取號
    if (molesProxy[mole]) {
        return getRandomMole();
    }
    setMole(mole, time);

    // 以下改成setMole()，位置在上方
    // // 狀態設為true
    // molesProxy[mole] = true;
    // //時間到一半就叫出下一隻地鼠
    // setTimeout(() => {
    //     if (!timeUp) {
    //         getRandomMole();
    //     }
    // }, time / 2);
    // //時間到就設定為false
    // setTimeout(() => {
    //     molesProxy[mole] = false;
    // }, time);
};

// 開始遊戲-注意HTML上有一個onClick="startGame()"
const startGame = e => {
    //如果時間還沒到，就不能重複按開始遊戲
    if (!timeUp) {
        return;
    }
    setScore(0); //控制分數的方訊，一開始先歸零
    timeUp = false; //開始遊戲計時
    getRandomMole(); //隨機出現地鼠的方訊
    setTimeout(() => {
        //關閉遊戲計時
        (timeUp = true), console.log("time's up");
    }, 10000);
};

// 開始按鈕
const btn = document.querySelector('.btn');
btn.addEventListener('click', startGame);
