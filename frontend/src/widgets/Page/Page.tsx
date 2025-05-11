import classNames from "shared/library/classNames/classNames";
import s from './Page.module.scss'
import { ReactNode, useRef } from "react";


interface PageProps {
    className?: string;
    children: ReactNode
}


export const Page = ({className, children}: PageProps) => {
    
    const pageRef = useRef<HTMLDivElement>(null);
    return (
        <section
            id="PAGE"
            ref={pageRef}
            className={classNames(s.Page, {}, [className])}>
            {children}
        </section>
    );
};