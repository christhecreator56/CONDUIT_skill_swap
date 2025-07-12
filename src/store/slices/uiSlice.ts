import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface UIState {
  isLoading: boolean
  modal: {
    isOpen: boolean
    type: string | null
    data: any
  }
  sidebar: {
    isOpen: boolean
  }
  notifications: Array<{
    id: string
    type: 'success' | 'error' | 'info' | 'warning'
    message: string
    duration?: number
  }>
}

const initialState: UIState = {
  isLoading: false,
  modal: {
    isOpen: false,
    type: null,
    data: null,
  },
  sidebar: {
    isOpen: false,
  },
  notifications: [],
}

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },
    openModal: (state, action: PayloadAction<{ type: string; data?: any }>) => {
      state.modal.isOpen = true
      state.modal.type = action.payload.type
      state.modal.data = action.payload.data || null
    },
    closeModal: (state) => {
      state.modal.isOpen = false
      state.modal.type = null
      state.modal.data = null
    },
    toggleSidebar: (state) => {
      state.sidebar.isOpen = !state.sidebar.isOpen
    },
    addNotification: (state, action: PayloadAction<{
      type: 'success' | 'error' | 'info' | 'warning'
      message: string
      duration?: number
    }>) => {
      const id = Math.random().toString(36).substr(2, 9)
      state.notifications.push({
        id,
        ...action.payload,
      })
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(
        notification => notification.id !== action.payload
      )
    },
  },
})

export const {
  setLoading,
  openModal,
  closeModal,
  toggleSidebar,
  addNotification,
  removeNotification,
} = uiSlice.actions

export default uiSlice.reducer 