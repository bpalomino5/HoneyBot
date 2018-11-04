/**
 * Base store class built around ES6 Weak Map
 *
 * @export
 * @class Store
 */
export default class Store {
  constructor() {
    this.data = new Map();
  }

  /**
   * Get item in store by case insensitive id
   *
   * @param {String} id Unique key for retrieval
   * @returns {Object} Value found in store
   */
  get(id) {
    return this.data.get(id.toLowerCase());
  }

  /**
   * Set item in store by case insensitive id
   *
   * @param {String} id Unique key for retrieval
   * @param {Object} value Object to add to store
   * @returns {Object} Value set in store
   */
  set(id, value) {
    return this.data.set(id.toLowerCase(), value);
  }

  /**
   * Delete item in store by case insensitive id
   *
   * @param {String} id Unique key for retrieval
   * @returns {Object} deleted object
   */
  delete(id) {
    const deleted = this.get(id);
    this.data.delete(id);
    return { deleted };
  }
}
