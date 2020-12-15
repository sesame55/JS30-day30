// 貼在console測試


let obj = {
    a: true,
    b: true,
};

// 代理obj
let objProxy = new Proxy(obj, {
    get(target, key) {
        console.log(target, key);
        return target(key);
    },
    set(target, key, value) {
        console.log(key, value);
        target[key] = value;
    },
});
