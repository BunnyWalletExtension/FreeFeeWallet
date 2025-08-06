interface CustomProvider {
    isMyWallet?: boolean;
    request(args: { method: string; params?: any[] }): Promise<any>;
}

interface Window {
    bunny?: CustomProvider;
}