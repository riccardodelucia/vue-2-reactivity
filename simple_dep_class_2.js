/**
 * This class is used to store the dependencies for one single data property.
 * Dependency = a data that derived from another data property, i.e. depends on that property.
 * The dependency object collects all dependencies for one data. Whenever this data changes, all its dependencies must be rerun through notify()
 * The dep class notifies, then, to all subscribers to rerun
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

let data = { price: 5, quantity: 2 };
let target, total, salePrice;

/**
 * Object.defineProperty allows to set an accessor descriptor on each data property.
 * For each property of data, we instantiate a dedicated dep object. This is called
 * from the get/ set method automatically, whenever the property is accessed/ modified.
 * Each time the property is accessed, we ensure the dependency that is accessing it
 *  is registered into the dep subscribers. Each time the dependency is changed, the property calls
 * dep.notify to rerun all dependencies.
 * The dep object, as well as internalValue are ensured to persist after Object.keys(data).forEach
 * thanks to the closure system.
 */
Object.keys(data).forEach((key) => {
  let internalValue = data[key];
  const dep = new Dep();

  Object.defineProperty(data, key, {
    get() {
      dep.depend();
      return internalValue;
    },
    set(newVal) {
      internalValue = newVal;
      dep.notify();
    },
  });
});

/**
 * The watcher is used to register the dependency to the dep object and execute the dependent function
 * for the first time. Since it calls the function, which in turn call the property of the data. The get
 * method of data calls depend(), which stores the current function as a dependency in the subscribers list
 */
function watcher(myFun) {
  target = myFun;
  //dep.depend(myFun);
  myFun();
  target = null;
}

// THIS IS THE CRUCIAL PART! WATCHERS EXECUTE THE DEPENDENCIES, WHICH IN TURN CAUSE THE ACCESS TO THE
// UNDERLYING DATA, WHICH FINALLY CALLS THE DEPEND FOR EACH ACCESSED PROPERTY.

// registers the dependency for both quantity and price
watcher(() => {
  total = data.quantity * data.price;
});

// registers the dependency only for price
watcher(() => {
  salePrice = data.price * 0.9;
});
