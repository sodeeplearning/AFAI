import { makeAutoObservable } from "mobx";

export class SidebarStore {
  selectedKey: number | null;

  constructor() {
    this.selectedKey = parseInt(localStorage.getItem("selectedKey") || "1", 10);
    makeAutoObservable(this);
  }

  setSelectedKey(key: number) {
    this.selectedKey = key;
    localStorage.setItem("selectedKey", key.toString());
  }
}


