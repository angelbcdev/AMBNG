class Animal {
  name: string;
  constructor(name: string) {
    this.name = name;
  }

  makeSound(): void {
    console.log(`${this.name} without sound!`);
  }
}

interface CanRun {
  name: string;
  run(): void;
}

interface CanSwim {
  name: string;
  swim(): void;
}

interface CanFly {
  name: string;
  fly(): void;
}

type Constructor<T = Animal> = new (...args: any[]) => T;

function Runnable<TBase extends Constructor>(Base: TBase) {
  return class extends Base implements CanRun {
    makeSound(): void {
      console.log(`${this.name} is making a sound!`);
    }
    run() {
      console.log(`${this.name} is running!`);
    }
  };
}

function Swimmable<TBase extends Constructor>(Base: TBase) {
  return class extends Base implements CanSwim {
    swim() {
      console.log(`${this.name} is swimming!`);
    }
  };
}

function Flyable<TBase extends Constructor>(Base: TBase) {
  return class extends Base implements CanFly {
    makeSound(): void {
      console.log(`${this.name} is making a sound!`);
    }
    fly() {
      console.log(`${this.name} is flying!`);
    }
  };
}

class Duck extends Flyable(Swimmable(Runnable(Animal))) {
  makeSound() {
    console.log("Quack!");
  }
}

class Dog extends Runnable(Animal) {
  makeSound() {
    console.log("Woof!");
  }
}

class Fish extends Swimmable(Animal) {
  makeSound() {
    console.log("Blub!");
  }
}

const duck = new Duck("Duck");
const dog = new Dog("Dog");
const fish = new Fish("Fish");

duck.makeSound();
dog.makeSound();
fish.makeSound();
