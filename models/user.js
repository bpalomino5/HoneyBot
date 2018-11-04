/**
 * User Model
 *
 * @class User
 */
export default class User {
  /**
   * @property {Array.<string>} - Defaults attributes for users
   */
  static DEFAULT_ATTRIBUTES = {
    sortOption: "best_match",
    isOpen: true,
    term: "restaurants"
  };

  /**
   * @property {Array.<string>} - Time since an item has become available
   */

  constructor(attributes) {
    const { id, sortOption, isOpen, term } = Object.assign(
      {},
      User.DEFAULT_ATTRIBUTES,
      attributes
    );

    this.id = id;
    this.sortOption = sortOption;
    this.isOpen = isOpen;
    this.term = term;
  }

  getPreferences() {
    const { sortOption, isOpen, term } = this;
    return { sortOption, isOpen, term };
  }

  setPreferences(preferences) {
    this.sortOption = preferences.sortOption;
    this.isOpen = preferences.isOpen;
    this.term = preferences.term;
  }
}
