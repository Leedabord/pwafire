//  Authors : Maye Edwin & Marta Wiśniewska @copyright : https://pwafire.org
class PWA {
  // Copy text...
  async copyText(text: string) {
    try {
      await navigator.clipboard.writeText(text);
      // Copied...
      return { type: 'success', message: `Copied` };
    } catch (error) {
      // Error...
      return { type: 'fail', error};
    }
  }

  // Copy image
  async copyImage(imgURL: RequestInfo) {
    try {
      const data = await fetch(imgURL);
      const blob = await data.blob();
      const result = await navigator.clipboard.write([
        new ClipboardItem(
          Object.defineProperty({}, blob.type, {
            value: blob,
            enumerable: true,
          }),
        ),
      ]);
      return result ? { type: 'success', message: `Copied` } : { type: 'fail', message: `Fail` };
    } catch (error) {
      // Error...
      return { type: 'fail', error };
    }
  }

  // Web Share...
  async Share(data: object) {
    // Check support...
    try {
      if (navigator.share) {
        navigator
          .share(data)
          .then(() => {
            // Shared...
            return { type: 'success', message: `Shared` };
          })
          .catch((error) => {
            // Error..
            return { error, type: 'fail', message: `Failed` };
          });
      } else {
        // No support...
        return {
          type: 'fail',
          error: {
            message: `Not supported`,
          },
        };
      }
    } catch (error) {
      // Error..
      return { error, type: 'fail', message: `Failed` };
    }
  }

  // Contacts Picker...
  async Contacts(props: {}, options: {}) {
    try {
      const contacts = await navigator.contacts.select(props, options);
      // Return contacts...
      return contacts;
    } catch (error) {
      // Error...
      return { type: 'fail', error };
    }
  }

  // Connectivity...
  Connectivity(online: () => void, offline: () => void) {
    // Once the DOM is loaded, check for connectivity...
    try {
      document.addEventListener('DOMContentLoaded', () => {
        // Offline Event...
        if (navigator.onLine) {
          online();
          return { type: 'success', message: `Online` };
        } else {
          offline();
          return { type: 'success', message: `Offline` };
        }
      });
    } catch (error) {
      // Error...
      return { type: 'fail', error };
    }
  }

  // Set badge...
  setBadge(unreadCount: number) {
    try {
      return navigator.setAppBadge(unreadCount).catch((error: any) => {
        // Do something with the error.
        return { type: 'fail', error };
      });
    } catch (error) {
      // Error...
      return { type: 'fail', error };
    }
  }
  
  // Clear badge...
  clearBadge() {
    try {
      // Clear the badge
      return navigator.clearAppBadge().catch((error: any) => {
        // Do something with the error.
        return { type: 'fail', error };
      });
    } catch (error) {
      // Error...
      return { type: 'fail', error };
    }
  }

  // Fullscreen...
  async Fullscreen() {
    try {
      if (document.fullscreenEnabled) {
        await document.documentElement.requestFullscreen();
        return { type: 'success', message: 'Fullscreen' };
      }
    } catch (error) {
      // Error...
      return { type: 'fail', error };
    }
  }

  // Notification...
  Notification(data: { title: string; options: object }) {
    const { title, options } = data;
    if ('Notification' in window) {
      return Notification.requestPermission()
        .then(async (permission) => {
          if (permission === 'granted') {
            return await navigator.serviceWorker.ready.then((registration) => {
              registration.showNotification(title, options);
              // Sent...
              return { type: 'success', message: `Sent` };
            });
          }
        })
        .catch((error) => {
          return { type: 'fail', error };
        });
    } else {
      return {
        type: 'fail',
        message: `Not supported`,
      };
    }
  }

  // Install...
  Install() {
    window.addEventListener('beforeinstallprompt', (event: any) => {
      // Stash the event so it can be triggered later...
      window.deferredPrompt = event;
    });
    const promptEvent = window.deferredPrompt;
    if (!promptEvent) {
      return { type: 'fail', message: `No manifest, or app exists` };
    } else {
      // Show the install prompt...
      promptEvent.prompt();
      // Log the result...
      promptEvent.userChoice.then((result: any) => {
        // Reset the deferred prompt variable, since rompt() can only be called once...
        window.deferredPrompt = null;
      });
      window.addEventListener('appinstalled', (event: any) => {
        return { type: 'success', message: `Installed` };
      });
    }
  }

  // Visibility...
  Visibility(isVisible: () => void, notAvailable: () => void) {
    try {
      if (document.visibilityState) {
        const state = document.visibilityState;
        if (state === `visible`) {
          // Call back function...
          isVisible();
          return { type: 'success', message: `Visible` };
        }
      } else {
        // Alternative...
        notAvailable();
        return {
          type: 'fail',
          message: `Not supported`,
        };
      }
    } catch (error) {
      // Error...
      return { type: 'fail', error };
    }
  }

  // Payment...
  async Payment(
    paydata: {
      paymentMethods: PaymentMethodData[];
      paymentDetails: PaymentDetailsInit;
      options: PaymentOptions | undefined;
    },
    validatePayment: (arg0: PaymentResponse) => void,
  ) {
    // Initiate user interface...
    try {
      const paymentRequest = new PaymentRequest(paydata.paymentMethods, paydata.paymentDetails, paydata.options);
      const paymentResponse = await paymentRequest.show();
      // Validate with backend...
      validatePayment(paymentResponse);
    } catch (error) {
      return { type: 'fail', error };
    }
  }
}

// Create pwafire object
const pwafire = {
  pwa: new PWA(),
};

// Export...
export default pwafire;
