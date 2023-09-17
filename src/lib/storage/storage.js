export { save, retrieve };

function _storageAvailable(type) {
  let storage;
  try {
    storage = window[type];
    const x = "__storage_test__";
    storage.setItem(x, x);
    storage.removeItem(x);
    return true;
  } catch (e) {
    return (
      e instanceof DOMException &&
      // everything except Firefox
      (e.code === 22 ||
        // Firefox
        e.code === 1014 ||
        // test name field too, because code might not be present
        // everything except Firefox
        e.name === "QuotaExceededError" ||
        // Firefox
        e.name === "NS_ERROR_DOM_QUOTA_REACHED") &&
      // acknowledge QuotaExceededError only if there's something already stored
      storage &&
      storage.length !== 0
    );
  }
}

function save(key, value) {
  if (!_storageAvailable("localStorage")) {
    console.error("Local storage unavailable.");
    return;
  }

  localStorage.setItem(key, JSON.stringify(value));
}

function retrieve(key) {
  if (!_storageAvailable("localStorage")) {
    console.error("Local storage unavailable.");
    return;
  }

  return JSON.parse(localStorage.getItem(key));
}
