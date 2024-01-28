/**
 * Execute from Node.js:
 * node
 * > .load simple_dep_class.js
 * Interact with the terminal as in the Chrome dev console
 */

/**
 * We can update price/ quantity and then update total by running dep.notify()
 */

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

let price = 5;
let quantity = 2;
let total = 0;

let target = null;

function watcher(myFunc) {
  target = myFunc;
  dep.depend();
  target();
  target = null;
}

const dep = new Dep();

// watcher is used to register a target (a dependency) on a specific dep object
watcher(() => {
  total = price * quantity;
});

// dependency total will be update upon running dep.notify()
