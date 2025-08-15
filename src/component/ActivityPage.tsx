import './styles/ActivityPage.css';
import * as img_lib from '../img/index';

const txsList = {
    "Dec 9, 2024": [
        {
            txHash: "5gh7WfrFTa4UYxc1wdeoz3CBCTtrcZF825MrbNPcZxCDM5qyd7U2aEDUJKWgkH5aKZhFU4GBoVxwRp5R9aeDGxSq",
            type: "Sent",
            token: "USDC",
            amount: "20",
            usd: "20",
        },
        {
            txHash: "3gh7WfrFTa4UYxc1wdeoz3CBCTtrcZF825MrbNPcZxCDM5qyd7U2aEDUJKWgkH5aKZhFU4GBoVxwRp5R9aeDGxSq",
            type: "Received",
            token: "ETH",
            amount: "0.05",
            usd: "100",
        },
    ],
    "Dec 8, 2024": [
        {
            txHash: "2gh7WfrFTa4UYxc1wdeoz3CBCTtrcZF825MrbNPcZxCDM5qyd7U2aEDUJKWgkH5aKZhFU4GBoVxwRp5R9aeDGxSq",
            type: "Sent",
            token: "BTC",
            amount: "0.01",
            usd: "500",
        },
    ],
};

function ActivityPage() {
    const clickTxs = (txHash: string) => {
        chrome.tabs.create({
            url: `https://solscan.io/tx/${txHash}`,
            active: true,
        });
    }

    return (
        <div className='activity-page'>
            <div style={{ fontSize: '15px', fontFamily: 'jbmn-bold' }}>LAST 30 TRANSACTIONS</div>
            {Object.keys(txsList).map((date) => (
                <div className='group-date-txs'>
                    <div style={{ fontSize: '12px' }}>{date}</div>
                    {(txsList as any)[date].map((tx: any) => (
                        <div className='tx-item' onClick={() => clickTxs(tx.txHash)}>
                            <img className='tx-item-token-img' src={(img_lib as any)[`logo_${tx.token}`]} />
                            <div className='tx-item-left'>
                                <div style={{ fontSize: '14px', color: '#fff' }}>{tx.type}</div>
                                <div style={{ fontSize: '12px', color: "#bfbcb7" }}>{tx.txHash.slice(0, 6)}...{tx.txHash.slice(-4)}</div>
                            </div>
                            <div className='tx-item-right'>
                                <div style={{ fontSize: '14px', color: tx.type === 'Sent' ? 'red' : 'green' }}>{`${tx.type === 'Sent' ? '-' : '+'}${tx.amount} ${tx.token}`}</div>
                                <div style={{ fontSize: '12px', color: "#bfbcb7" }}>${tx.usd}</div>
                            </div>
                        </div>
                    ))}
                </div>
            ))}
        </div>
    )
}

export default ActivityPage;