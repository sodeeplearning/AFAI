import { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { useStore } from 'app/providers/StoreProvider';

export const ScrollRecovery = observer(() => {
    const { scrollPositionStore } = useStore();
    
    useEffect(() => {
        const pageElement = document.querySelector('#PAGE');
        if (pageElement) {
            scrollPositionStore.setPageElement(pageElement as HTMLElement);
        }
    }, [scrollPositionStore]);
    
    useEffect(() => {
        scrollPositionStore.restoreScrollPosition();
    }, [scrollPositionStore]);
    
    return null;
});

export default ScrollRecovery;
