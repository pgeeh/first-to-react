import {PATH_ROOT} from '../constants';

/**
 * Include only active classes by key when their value is true
 * @param {object} classes class to active mapping
 * @return {string} space separated list of active classes
 */
export const activeClasses = (classes) => {
  const active = [];
  const keys = Object.keys(classes);

  for (let i = 0; i < keys.length; i++) {
    const prop = keys[i];
    if (Object.prototype.hasOwnProperty.call(classes, prop)) {
      if (classes[prop] === true) {
        active.push(prop);
      }
    }
  }

  return active.join(' ');
};

/**
 * Read the file at the provided path and provide the contents to the callback.
 * @param {string} path path to the file
 * @param {func} callback function to provide the retrieved text
 */
export const readFile = (path, callback) => {
  fetch(path)
      .then((response) => {
        return response.text();
      })
      .then((text) => {
        callback(text);
      });
};

/**
 * Create the full path, from the provided relative path.
 * Relative path should start with /
 * @param {string} path relative path
 * @return {string} full path
 */
export const fullLinkPath = (path) => PATH_ROOT + path;
