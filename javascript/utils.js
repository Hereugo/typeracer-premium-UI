function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


// COMPONENTS FOR WORKING WITH CHROME STORAGE
const getStorageData = keys =>
  new Promise((resolve, reject) =>
    chrome.storage.local.get(keys, result =>
      chrome.runtime.lastError
        ? reject(Error(chrome.runtime.lastError.message))
        : resolve(result)
    )
  )
// const { data } = await getStorageData(['data'])

const setStorageData = data =>
  new Promise((resolve, reject) =>
    chrome.storage.local.set(data, () =>
      chrome.runtime.lastError
        ? reject(Error(chrome.runtime.lastError.message))
        : resolve()
    )
  )
// await setStorageData({ data: [someData] })


function onReady(parent, element, callback) {
  if ($(element)[0]) {
    callback();
    return;
  }

  const readyObserver = new MutationObserver(function (mutations, me) {
    if ($(element)[0]) {

      callback();

      me.disconnect();
    }
  });
  readyObserver.observe($(parent)[0], {
    childList: true,
    subtree: true,
  });
}