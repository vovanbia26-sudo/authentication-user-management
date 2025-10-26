import { createSlice } from '@reduxjs/toolkit';

// Initial state
const initialState = {
  theme: localStorage.getItem('theme') || 'light',
  sidebarOpen: false,
  notifications: [],
  loading: {
    global: false,
    auth: false,
    user: false,
    upload: false,
  },
  modals: {
    confirmDelete: {
      open: false,
      title: '',
      message: '',
      onConfirm: null,
      data: null,
    },
    userRole: {
      open: false,
      user: null,
    },
    avatar: {
      open: false,
    },
  },
  alerts: {
    show: false,
    type: 'info', // success, error, warning, info
    title: '',
    message: '',
    autoClose: true,
    duration: 5000,
  },
};

// UI slice
const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    // Theme
    toggleTheme: (state) => {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
      localStorage.setItem('theme', state.theme);
    },
    setTheme: (state, action) => {
      state.theme = action.payload;
      localStorage.setItem('theme', state.theme);
    },
    
    // Sidebar
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen: (state, action) => {
      state.sidebarOpen = action.payload;
    },
    
    // Notifications
    addNotification: (state, action) => {
      const notification = {
        id: Date.now() + Math.random(),
        timestamp: new Date().toISOString(),
        read: false,
        ...action.payload,
      };
      state.notifications.unshift(notification);
      
      // Keep only last 50 notifications
      if (state.notifications.length > 50) {
        state.notifications = state.notifications.slice(0, 50);
      }
    },
    markNotificationRead: (state, action) => {
      const notification = state.notifications.find(n => n.id === action.payload);
      if (notification) {
        notification.read = true;
      }
    },
    markAllNotificationsRead: (state) => {
      state.notifications.forEach(n => n.read = true);
    },
    removeNotification: (state, action) => {
      state.notifications = state.notifications.filter(n => n.id !== action.payload);
    },
    clearNotifications: (state) => {
      state.notifications = [];
    },
    
    // Loading states
    setGlobalLoading: (state, action) => {
      state.loading.global = action.payload;
    },
    setAuthLoading: (state, action) => {
      state.loading.auth = action.payload;
    },
    setUserLoading: (state, action) => {
      state.loading.user = action.payload;
    },
    setUploadLoading: (state, action) => {
      state.loading.upload = action.payload;
    },
    
    // Modals
    openConfirmModal: (state, action) => {
      state.modals.confirmDelete = {
        open: true,
        ...action.payload,
      };
    },
    closeConfirmModal: (state) => {
      state.modals.confirmDelete = {
        open: false,
        title: '',
        message: '',
        onConfirm: null,
        data: null,
      };
    },
    openUserRoleModal: (state, action) => {
      state.modals.userRole = {
        open: true,
        user: action.payload,
      };
    },
    closeUserRoleModal: (state) => {
      state.modals.userRole = {
        open: false,
        user: null,
      };
    },
    openAvatarModal: (state) => {
      state.modals.avatar.open = true;
    },
    closeAvatarModal: (state) => {
      state.modals.avatar.open = false;
    },
    
    // Alerts
    showAlert: (state, action) => {
      state.alerts = {
        show: true,
        type: action.payload.type || 'info',
        title: action.payload.title || '',
        message: action.payload.message || '',
        autoClose: action.payload.autoClose !== false,
        duration: action.payload.duration || 5000,
      };
    },
    hideAlert: (state) => {
      state.alerts.show = false;
    },
    
    // Success/Error helpers
    showSuccess: (state, action) => {
      state.alerts = {
        show: true,
        type: 'success',
        title: action.payload.title || 'Success',
        message: action.payload.message || '',
        autoClose: true,
        duration: 3000,
      };
    },
    showError: (state, action) => {
      state.alerts = {
        show: true,
        type: 'error',
        title: action.payload.title || 'Error',
        message: action.payload.message || '',
        autoClose: action.payload.autoClose !== false,
        duration: action.payload.duration || 5000,
      };
    },
    showWarning: (state, action) => {
      state.alerts = {
        show: true,
        type: 'warning',
        title: action.payload.title || 'Warning',
        message: action.payload.message || '',
        autoClose: true,
        duration: 4000,
      };
    },
    showInfo: (state, action) => {
      state.alerts = {
        show: true,
        type: 'info',
        title: action.payload.title || 'Info',
        message: action.payload.message || '',
        autoClose: true,
        duration: 3000,
      };
    },
  },
});

export const {
  // Theme
  toggleTheme,
  setTheme,
  
  // Sidebar
  toggleSidebar,
  setSidebarOpen,
  
  // Notifications
  addNotification,
  markNotificationRead,
  markAllNotificationsRead,
  removeNotification,
  clearNotifications,
  
  // Loading
  setGlobalLoading,
  setAuthLoading,
  setUserLoading,
  setUploadLoading,
  
  // Modals
  openConfirmModal,
  closeConfirmModal,
  openUserRoleModal,
  closeUserRoleModal,
  openAvatarModal,
  closeAvatarModal,
  
  // Alerts
  showAlert,
  hideAlert,
  showSuccess,
  showError,
  showWarning,
  showInfo,
} = uiSlice.actions;

// Selectors
export const selectUI = (state) => state.ui;
export const selectTheme = (state) => state.ui.theme;
export const selectSidebarOpen = (state) => state.ui.sidebarOpen;
export const selectNotifications = (state) => state.ui.notifications;
export const selectUnreadNotifications = (state) => 
  state.ui.notifications.filter(n => !n.read);
export const selectLoading = (state) => state.ui.loading;
export const selectModals = (state) => state.ui.modals;
export const selectAlerts = (state) => state.ui.alerts;

export default uiSlice.reducer;
