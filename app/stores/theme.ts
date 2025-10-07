import { defineStore } from 'pinia'

export const useThemeStore = defineStore('theme', {
  state: () => ({
    theme: 1
  }),

  actions: {
    changeTheme(theme: number) {
      this.theme = theme
    }
  }
})
