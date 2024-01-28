let data = { price: 5, quantity: 2 };
let target;

/**
 * This class is used to store the dependencies for one single data property.
 * Dependency = a function that involves the original data property, i.e. depends on that property
 * The dependency object is charged to list all property dependencies for data and to call
 * all dependency functions when notify() is called
 */
class Dep {
  constructor() {
    this.subscribers = [];
  }
  depend() {
    if (target && !this.subscribers.includes(target)) {
      this.subscribers.push(target);
    }
  }
  notify() {
    this.subscribers.forEach((sub) => sub());
  }
}

/**
 * Dependencies are store in a map (iterable)
 * For each key of data, we set an entry that contains the Dep object for that property.
 */
let deps = new Map();
Object.keys(data).forEach((key) => {
  deps.set(key, new Dep());
});

let data_without_proxy = data; // copy of data

/**
 * Data is reassigned with a proxy, which intercepts operations on the object itself.
 */
data = new Proxy(data_without_proxy, {
  get(obj, key) {
    deps.get(key).depend();
    return obj[key];
  },
  set(obj, key, newVal) {
    obj[key] = newVal;
    deps.get(key).notify();
    return true;
  },
});
/**
 * The watcher is used to first execute the dependent function. For each function
 * all accessed dependencies trigger dep.depend(), that subscribe the current function as a
 * dependency for the property it is called on. The function is registered to all properties which
 * the function depends on.
 */
function watcher(myFun) {
  target = myFun;
  //dep.depend(myFun);
  myFun();
  target = null;
}

let total = 0;

// subscribed to both data.quantity and data.price
watcher(() => {
  total = data.quantity * data.price;
});

// subscribed to data.price
watcher(() => {
  salePrice = data.price * 0.9;
});

console.log(`total = ${total}`);
data.price = 20;
console.log(`total = ${total}`);
data.quantity = 10;
console.log(`total = ${total}`);

/**
 * Adding a new property to the object. Since get is called for each property of the target object,
 * newy added properties call the get trap too. Since this get trap subscribes the new property to the dep object,
 * each new property automatically becomes reactive.
 */
deps.set("discount", new Dep());
data["discount"] = 5;

let salePrice = 0;

watcher(() => {
  salePrice = data.price - data.discount;
});

console.log(`salePrice = ${salePrice}`);
data.discount = 7.5;
console.log(`salePrice = ${salePrice}`);
