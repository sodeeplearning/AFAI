import { makeAutoObservable } from 'mobx';
import { RoutePath } from 'shared/config/routeConfig/routeConfig';

interface ScrollPositionsState {
    [path: string]: number;
}

export class ScrollPositionStore {
    scrollPositions: ScrollPositionsState = {};
    pageElement: HTMLElement | null = null;
    
    private excludePaths = [RoutePath.agents, RoutePath.settings];

    constructor() {
        makeAutoObservable(this);
    }

    setPageElement(element: HTMLElement | null) {
        this.pageElement = element;
    }

    saveScrollPosition(path: string, position: number) {
        this.scrollPositions[path] = position;
    }

    saveCurrentPosition(path: string) {
        if (this.pageElement) {
            this.scrollPositions[path] = this.pageElement.scrollTop;
        }
    }

    getScrollPosition(path: string): number {
        return this.scrollPositions[path] || 0;
    }

    shouldScrollToBottom(path: string): boolean {
        return !this.excludePaths.some(excludePath => path.includes(excludePath));
    }

    restoreScrollPosition() {
        if (!this.pageElement) return;
        
        const currentPath = window.location.pathname;
        
        setTimeout(() => {
            if (!this.pageElement) return;
            
            if (this.shouldScrollToBottom(currentPath)) {
                this.pageElement.scrollTop = this.pageElement.scrollHeight;
            } else {
                const savedPosition = this.getScrollPosition(currentPath);
                this.pageElement.scrollTop = savedPosition;
            }
        }, 400);
    }
}