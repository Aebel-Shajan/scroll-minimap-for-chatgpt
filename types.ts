export interface HTMLElementItem {
  element: HTMLElement,
  children: HTMLElementItem[]
}

export interface favouritedChat {
  iconName: string,
  chatId: string,
  scrollTop: number,
  preview: string,
}


export interface ReactComponentMap {
  [key: string]: React.ComponentType<any>
}
