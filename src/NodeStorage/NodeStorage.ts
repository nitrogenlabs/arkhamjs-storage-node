/**
 * Copyright (c) 2018, Nitrogen Labs, Inc.
 * Copyrights licensed under the MIT License. See the accompanying LICENSE file for terms.
 */

import * as PersistStorage from 'node-persist';

export interface NodeStorageOptions {
  readonly continuous?: boolean;
  readonly dir?: string;
  readonly encoding?: string;
  readonly forgiveParseErrors?: boolean;
  readonly interval?: boolean | number;
  readonly logging?: any;
  readonly parse?: (text: string, reviver?: (key: any, value: any) => any) => any;
  readonly stringify?: any;
  readonly ttl?: boolean | number;
  readonly expiredInterval?: number;
}

export class NodeStorage {
  private options: NodeStorageOptions = {
    continuous: true,
    dir: '/tmp',
    encoding: 'utf8',
    expiredInterval: 3 * 60 * 1000,
    forgiveParseErrors: false,
    interval: false,
    logging: false,
    parse: JSON.parse,
    stringify: JSON.stringify,
    ttl: false
  };

  constructor(options: NodeStorageOptions = {}) {
    this.options = {...this.options, ...options};
    PersistStorage.initSync(this.options);
  }

  /**
   * Removes all keys from persistant data.
   *
   * @returns {Promise<boolean>} Whether data was successfully removed.
   */
  static clearPersistData(): Promise<boolean> {
    try {
      return PersistStorage.clear()
        .then(() => Promise.resolve(true))
        .catch(() => Promise.resolve(false));
    } catch(error) {
      return Promise.resolve(false);
    }
  }

  /**
   * Clears all data from storage.
   *
   * @returns {Promise<boolean>} Whether data was successfully saved.
   */
  clearStorageData(): Promise<boolean> {
    return NodeStorage.clearPersistData();
  }

  /**
   * Removes a key from persistant data.
   *
   * @param {string} key Key associated with the data to remove.
   * @returns {Promise<boolean>} Whether data was successfully removed.
   */
  static delPersistData(key: string): Promise<boolean> {
    try {
      return PersistStorage.removeItem(key)
        .then(() => Promise.resolve(true))
        .catch(() => Promise.resolve(false));
    } catch(error) {
      return Promise.resolve(false);
    }
  }

  /**
   * Get a key value from persistant data.
   *
   * @param {string} key The key for data.
   * @returns {Promise<any>} the data object associated with the key.
   */
  static getPersistData(key: string): Promise<any> {
    try {
      return PersistStorage.getItem(key)
        .then((value: string) => value ? JSON.parse(value) : null)
        .catch(() => Promise.resolve(null));
    } catch(error) {
      return Promise.resolve(null);
    }
  }

  /**
   * Get a key value from storage.
   *
   * @param {string} key The key for data.
   * @returns {Promise<any>} the data object associated with the key.
   */
  getStorageData(key: string): Promise<any> {
    return NodeStorage.getPersistData(key);
  }

  /**
   * Saves data to persistant data.
   *
   * @param {string} key Key to store data.
   * @param {any} value Data to store.
   * @returns {Promise<boolean>} Whether data was successfully saved.
   */
  static setPersistData(key: string, value): Promise<boolean> {
    try {
      return PersistStorage.setItem(key, value)
        .then(() => true)
        .catch(() => Promise.resolve(false));
    } catch(error) {
      return Promise.resolve(false);
    }
  }

  /**
   * Saves data to storage.
   *
   * @param {string} key Key to store data.
   * @param {any} value Data to store.
   * @returns {Promise<boolean>} Whether data was successfully saved.
   */
  setStorageData(key: string, value): Promise<boolean> {
    return NodeStorage.setPersistData(key, value);
  }
}
