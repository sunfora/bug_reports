class Example {
  /**
   * Returns simple point2d.
   *
   * @returns {{x: 1, y: 2}}
   */
  test() {
    return {x: 1, y: 2}
  }
}

/**
 * @type {"}" | "{"}
 */
const x = "{";
/**
 * @type {`
 * @type {"}" | "{"}
 * `}
 */
const y = `
 * @type {"}" | "{"}
 * `;
