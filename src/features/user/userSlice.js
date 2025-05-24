import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../lib/axios";

const BASE_URL = "https://learnify-server-s6fg.onrender.com/api";

export const fetchUserProfile = createAsyncThunk(
  "user/fetchProfile",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/user/${userId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateUserProfile = createAsyncThunk(
  "user/updateProfile",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await api.post(
        `/user/edit/${userData.userId}`, 
        userData.userData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchEnrolledCourses = createAsyncThunk(
  "user/fetchEnrolledCourses",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/user/enrolled-courses/${userId}`);
      return response.data.courses;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchCourseProgress = createAsyncThunk(
  "user/fetchCourseProgress",
  async ({ userId, courseId }, { rejectWithValue }) => {
    try {
      const response = await api.get(`/progress/${userId}/${courseId}`);
      return response.data;
    } catch (error) {
      // If progress is not found, return default progress values
      if (error.response?.status === 404 && error.response?.data?.message === "Progress not found") {
        return {
          courseId,
          userId,
          completedLessonsCount: 0,
          completedVideosCount: 0,
          totalLessonsCount: 0,
          totalVideosCount: 0,
          completedLessons: [],
          completedVideos: [],
          courseCompletionPercentage: 0
        };
      }
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchInstructors = createAsyncThunk(
  "user/fetchInstructors",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/instructors");
      return response.data.instructors;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const enrollInCourse = createAsyncThunk(
  "user/enrollInCourse",
  async ({ userId, courseId }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/user/enroll/${userId}`, { courseId });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const initialState = {
  profile: null,
  enrolledCourses: [],
  courseProgress: {},
  instructors: [],
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    clearProfile: (state) => {
      state.profile = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload.data;
        state.error = null;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to fetch user profile";
      })
      .addCase(updateUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload.data;
        state.error = null;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload?.message || "Failed to update user profile";
      })
      .addCase(fetchEnrolledCourses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEnrolledCourses.fulfilled, (state, action) => {
        state.loading = false;
        state.enrolledCourses = action.payload.enrolledCourseDetails || [];
        state.error = null;
      })
      .addCase(fetchEnrolledCourses.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload?.message || "Failed to fetch enrolled courses";
      })
      .addCase(fetchCourseProgress.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCourseProgress.fulfilled, (state, action) => {
        state.loading = false;
        state.courseProgress[action.payload.courseId] = action.payload;
        state.error = null;
      })
      .addCase(fetchCourseProgress.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload?.message || "Failed to fetch course progress";
      })
      .addCase(fetchInstructors.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInstructors.fulfilled, (state, action) => {
        state.loading = false;
        state.instructors = action.payload;
      })
      .addCase(fetchInstructors.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to fetch instructors";
      })
      .addCase(enrollInCourse.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(enrollInCourse.fulfilled, (state, action) => {
        state.loading = false;
        state.enrolledCourses = [...state.enrolledCourses, action.payload.course];
        state.error = null;
      })
      .addCase(enrollInCourse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to enroll in course";
      });
  },
});

export const { clearProfile, clearError } = userSlice.actions;
export default userSlice.reducer;
