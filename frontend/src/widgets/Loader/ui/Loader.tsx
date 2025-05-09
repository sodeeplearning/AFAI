import s from "./Loader.module.scss"
import { classNames } from "shared/library/classNames/classNames"

interface LoaderProps {
    className?: string;
}
export const Loader = ({ className }: LoaderProps) => {
    return (
        <span className={classNames(s.loader, {}, [className])}></span>
    )
}

export default Loader;