// ajm: /// <reference lib="webworker" />
// ajm: declare const self: ServiceWorkerGlobalScope
// ajm: export declare let client: Client | MessagePort | ServiceWorker | null;

try {
  console.info("> serverpushnotifications.js");
  let client = null;

  self.addEventListener("activate", event => {
    console.info("self.activate:", event);
  });

  self.addEventListener("activate", event => {
    console.info("self.activate:", event);
  });

  self.addEventListener("message", event => {
    console.info("self.message:", event);
    client = event.source;
  });

  self.addEventListener("push", event => {
    console.info("self.push:", event);
    const payload = event.data?.json();
    if (client) {
      client.postMessage({ pushNotification: payload.payload });
    }
    self.registration.showNotification(payload.title, {
      body: payload.payload
    });
  });
} catch(e) {
  console.error(e);
}
   