import { useState } from "react";
import './styles/Chains.css';
import * as img_lib from '../img/index';
import { useSelector } from 'react-redux';
import { useDispatch } from "react-redux";
import { changeCurrentChain, changeRpc } from "../redux/slices/chainSlice";

const listChains = [
    "Base",
    "Solana",
    "Solana Devnet",
    "Solana Testnet",
];
const logoChains = [
    img_lib.logo_base,
    img_lib.logo_solana,
    img_lib.logo_solana,
    img_lib.logo_solana,
];
const rpcs = [
    "https://base.drpc.org",
    "https://api.mainnet-beta.solana.com",
    "https://api.devnet.solana.com",
    "https://api.testnet.solana.com",
];

const listPages: string[] = ['token-page', 'earn-page', 'activity-page'];

function Chains() {
    const pageCurrent = useSelector((state: any) => state.page.value);
    const [indexChain, setIndexChain] = useState(1);
    const [showChains, setShowChains] = useState(false);
    const [filter, setFilter] = useState('');
    const dispatch = useDispatch();

    const onChangeFilter = (e: any) => {
        setFilter(e.target.value.toLowerCase());
    };

    return (
        listPages.includes(pageCurrent) &&
        <div className="chains">

            <div className="current-chain"
                onClick={() => setShowChains(true)}
            >
                <img className="logo-current-chain" alt="logo-current-chain" src={logoChains[indexChain]} />
                {listChains[indexChain].toUpperCase() /*+ " ▾"*/}
                <img className="logo-choose-chain" alt="logo-choose-chain" src={img_lib.choose_icon} />
            </div>

            {showChains &&
                <>
                    <div className="outer" onClick={() => setShowChains(false)} />
                    <div className="chain-list">
                        <div style={{ marginTop: '10px', marginBottom: '10px', fontSize: '15px' }}>Networks</div>
                        <div className="wrap-filter-chain" style={{ marginBottom: '10px' }}>
                            <img className="icon-find" src={img_lib.icon_find} />
                            <input className="filter-chain" type='text' placeholder='Search for a chain' onChange={onChangeFilter} />
                        </div>
                        {listChains
                            .filter(chain => chain.toLowerCase().includes(filter))
                            .map((chain, index) => (
                                <div
                                    className={`chain-item`}
                                    style={{ marginBottom: '5px' }}
                                    onClick={() => {
                                        setIndexChain(index);
                                        setShowChains(false);
                                        dispatch(changeCurrentChain(listChains[index]));
                                        dispatch(changeRpc(rpcs[index]));
                                    }}
                                >
                                    <img className="logo-chain-item" alt="logo-chain-item" src={logoChains[index]} />
                                    <div className="content-chain-item">
                                        <div className="row-1">{chain}</div>
                                        <div className="row-2">
                                            <div style={{ color: "#7F7D77" }}>{chain}</div>
                                            <div style={{ color: "#fff" }}>.</div>
                                            <div style={{ color: "#fff" }}>$0.0</div>
                                        </div>
                                    </div>
                                    <img style={{ marginLeft: 'auto', height: '15px' }} src={img_lib[index === indexChain ? 'stared' : 'star']} />
                                </div>
                            ))}
                    </div>
                </>
            }

        </div>
    )
}

export default Chains;