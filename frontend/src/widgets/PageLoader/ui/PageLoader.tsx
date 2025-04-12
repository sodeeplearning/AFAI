
import s from './PageLoader.module.scss'


export const PageLoader = () => {
    return (
        <div className={s.PageLoader}>
            <span className={s.loader}></span>
        </div>
    )
}