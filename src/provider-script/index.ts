class CustomProvider {
    isMyWallet: boolean;

    constructor() {
        this.isMyWallet = true;
    }

    request(args: { method: string; params?: any[] }): Promise<any> {
        return new Promise((resolve, reject) => {
            chrome.runtime.sendMessage(
                { method: args.method, params: args.params },
                (response) => {
                    if (response.error) {
                        reject(new Error(response.error));
                    } else {
                        resolve(response.result);
                    }
                }
            );
        });
    }
}

window.bunny = new CustomProvider();
window.dispatchEvent(new Event('bunny#initialized'));