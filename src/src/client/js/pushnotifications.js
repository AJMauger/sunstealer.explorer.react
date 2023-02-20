// ajm: /// <reference lib="webworker" />
// ajm: declare const self: ServiceWorkerGlobalScope
// ajm: export declare let client: Client | MessagePort | ServiceWorker | null;

let client = null;

self.addEventListener("message", event => {
  console.info(`self.addEventListener("message" ...`);
  client = event.source;
});

self.addEventListener("push", event => {
  console.info(`self.addEventListener("push", ${event.data} client: ${!!client}`);
  // ajm: JSON.stringify({ payload: request.body.payload 
  const payload = event.data?.json();
  if (client) {
    client.postMessage({ pushNotification: payload.payload });
  }

  console.info(`self.registration.showNotification(${payload.payload}`);
  self.registration.showNotification(payload.title, {
    body: payload.payload
  });
});
