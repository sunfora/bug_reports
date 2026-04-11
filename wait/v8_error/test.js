export class Example {
  static at() {
    const ex = new Example();
    ex.deep();
  }
  
  deep() {
    this.#unused();
  }

  broken(x) {
    const x = 1;
  }

  #unused() {
  }
}
