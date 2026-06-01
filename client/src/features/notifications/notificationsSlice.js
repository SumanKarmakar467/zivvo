// Selectors: see store/selectors.js
/** @typedef {import('../../store/types/notificationsTypes').NotificationsState} NotificationsState */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api/axios";

const initialState = {
  items: [],
  unreadCount: 0,
  status: "idle",
  error: null,
  page: 1,
  pages: 1
};

const extractError = (error) => error?.response?.data?.message || error?.message || "Request failed";

export const fetchNotifications = createAsyncThunk(
  "notifications/fetchNotifications",
  async ({ page = 1, limit = 20, unreadOnly = false } = {}, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/notifications", { params: { page, limit, unreadOnly } });
      return data;
    } catch (error) {
      return rejectWithValue(extractError(error));
    }
  }
);

export const markAsRead = createAsyncThunk("notifications/markAsRead", async (id, { rejectWithValue }) => {
  try {
    const { data } = await api.patch(`/notifications/${id}/read`);
    return data;
  } catch (error) {
    return rejectWithValue(extractError(error));
  }
});

export const markAllAsRead = createAsyncThunk("notifications/markAllAsRead", async (_, { rejectWithValue }) => {
  try {
    await api.patch("/notifications/read-all");
    return true;
  } catch (error) {
    return rejectWithValue(extractError(error));
  }
});

export const deleteNotification = createAsyncThunk("notifications/deleteNotification", async (id, { rejectWithValue }) => {
  try {
    await api.delete(`/notifications/${id}`);
    return id;
  } catch (error) {
    return rejectWithValue(extractError(error));
  }
});

const notificationsSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    addNotification: (state, action) => {
      state.items = [action.payload, ...state.items];
      if (!action.payload?.isRead) state.unreadCount += 1;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload.items || [];
        state.unreadCount = action.payload.unreadCount || 0;
        state.page = action.payload.page || 1;
        state.pages = action.payload.pages || 1;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(markAsRead.fulfilled, (state, action) => {
        const idx = state.items.findIndex((item) => String(item._id) === String(action.payload._id));
        if (idx !== -1 && !state.items[idx].isRead) {
          state.items[idx].isRead = true;
          state.unreadCount = Math.max(0, state.unreadCount - 1);
        }
      })
      .addCase(markAllAsRead.fulfilled, (state) => {
        state.items = state.items.map((item) => ({ ...item, isRead: true }));
        state.unreadCount = 0;
      })
      .addCase(deleteNotification.fulfilled, (state, action) => {
        const target = state.items.find((item) => String(item._id) === String(action.payload));
        if (target && !target.isRead) state.unreadCount = Math.max(0, state.unreadCount - 1);
        state.items = state.items.filter((item) => String(item._id) !== String(action.payload));
      });
  }
});

export const { addNotification } = notificationsSlice.actions;
export default notificationsSlice.reducer;
