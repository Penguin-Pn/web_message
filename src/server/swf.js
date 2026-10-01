let msgs = 0;
function msg(data) {
  return new Promise((resolve) => {
    msgs = msgs + 1;
    const m = msgs;
    navigator.serviceWorker.controller.postMessage({
      payload: data,
      id: m
    });
    function handler(event) {
      let payload = event.data.payload;
      let id = event.data.id;
      if(id == m) {
        navigator.serviceWorker.removeEventListener('message', handler);
        resolve(payload);
      }
    }
    navigator.serviceWorker.addEventListener('message', handler);
  });
}
function pushof(data, url, bool) {
  return msg(['pushof', data, url, bool]);
}
function list() {
  return msg('list');
}
function update() {
  return msg('update');
}
if (typeof window !== 'undefined') {
  window.sw = {};
  window.sw.list = list;
  window.sw.update = update;
  window.sw.pushof = pushof;
}