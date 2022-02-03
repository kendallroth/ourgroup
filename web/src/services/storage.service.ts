/**
 * Wrapper around local storage
 */
class StorageService {
  /**
   * Get a boolean value from local storage
   *
   * @param   key - Local storage key
   * @returns     - Boolean value
   */
  getBoolean(key: string): boolean {
    const booleanValue = localStorage.getItem(key);
    if (!booleanValue) return false;

    try {
      return Boolean(JSON.parse(booleanValue));
    } catch (e) {
      return false;
    }
  }

  /**
   * Get a boolean value from local storage
   *
   * @param  key   - Local storage key
   * @param  value - Boolean value
   */
  setBoolean(key: string, value: boolean): void {
    localStorage.setItem(key, JSON.stringify(value));
  }
}

const singleton = new StorageService();
export default singleton;
