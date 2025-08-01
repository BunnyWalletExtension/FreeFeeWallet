import './styles/SwitchPage.css';
import { useDispatch, useSelector } from 'react-redux';
import { changePage } from '../redux/slices/pageSlice';
import * as img_lib from '../img/index'

const listPages: string[] = ['token-page', 'earn-page', 'swap-page', 'activity-page'];

function SwitchPage() {
    const pageCurrent = useSelector((state: any) => state.page.value);
    const dispatch = useDispatch();

    return (
        listPages.includes(pageCurrent) &&
        <div className='switch-page'>
            {listPages.map((page) => (
                <div
                    key={page}
                    className={`switch-page-item`}
                    onClick={() => dispatch(changePage(page))}
                >
                    <img
                        className='switch-img'
                        alt={page}
                        src={(img_lib as any)[`${pageCurrent === page ? 'clicked_' : ''}${page.replace('-page', '_button')}`]}
                    />
                </div>
            ))}
        </div>
    );
}

export default SwitchPage;