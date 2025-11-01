import { _configuration, _logger } from "../index";_logger

export const publicVapidKey = "BK9WyTntubhYmSo5dlE6mlJW06XiPtZrZa5EdGLUyLp1RA8AHj8Q3sqlPmQOC7WpKtxhVxW9BBH0z4FXqUU7hsQ";

export const publishPushNotification = async () => {
  if (navigator.serviceWorker) {
    const registration: ServiceWorkerRegistration
      =await navigator.serviceWorker.register(`./serverpushnotifications.js`, { scope: `./` });

    // ajm: ready
    navigator.serviceWorker.ready.then(async (registration: ServiceWorkerRegistration) => {
      _logger.LogDebug("Push notification : waiting for subscription ...");
      const subscription: PushSubscription=await registration.pushManager.subscribe({ userVisibleOnly: true, 
        // applicationServerKey: urlBase64ToUint8Array(publicVapidKey) 
      });
      _logger.LogDebug("subscribed");


      _logger.LogDebug(`navigator.serviceWorker.registration.active: ${!!registration.active}`);
      registration.active?.postMessage("init");

      const data: any ={
        payload: new Date().toLocaleString(), 
        subscription
      }
      const r: Response = await fetch(`${document.location.origin}${_configuration.configuration.ingress}/subscribe`, { method: "POST", body: JSON.stringify(data), headers: { "Content-Type": "application/json" } });
      _logger.LogDebug(`/subscribe response: HTTP ${r.status}; ${r.statusText}`);
    }).catch((e) => {
      _logger.LogException(e);
    });

    if (!navigator.serviceWorker.onmessage) {
      navigator.serviceWorker.onmessage = (event: MessageEvent) => {
        _logger.LogWarning(`Notification: ${event.data.pushNotification}`);
      }
    }

    if (!navigator.serviceWorker.onmessageerror) {
      navigator.serviceWorker.onmessageerror = (event: MessageEvent) => {
        _logger.LogError(`Serviceworker: ${JSON.stringify(event.data)}`);
      }
    }
  } else {
    _logger.LogError("Service workers are not supported in this browser");
  }
}

const urlBase64ToUint8Array = (base64String: string): Uint8Array => {
  const padding = "=".repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

