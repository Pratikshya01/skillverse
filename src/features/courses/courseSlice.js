import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../lib/axios";

export const fetchCourses = createAsyncThunk(
  "courses/fetchCourses",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/courses");
      return {
        courses: response.data.courses,
        total: response.data.total,
      };
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchCourseById = createAsyncThunk(
  "courses/fetchCourseById",
  async (courseId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/course/${courseId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const createCourse = createAsyncThunk(
  "courses/createCourse",
  async (courseData, { rejectWithValue }) => {
    try {
      const response = await api.post("/course/create", courseData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const filterCoursesByCategory = createAsyncThunk(
  "courses/filterByCategory",
  async (categoryIds, { rejectWithValue }) => {
    try {
      const response = await api.get(
        `/course/filter/category?category=${categoryIds.join(",")}`
      );
      return {
        courses: response.data.data,
        total: response.data.totalCount,
      };
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const filterCoursesByInstructor = createAsyncThunk(
  "courses/filterByInstructor",
  async (instructorId, { rejectWithValue }) => {
    try {
      const response = await api.get(
        `/course/filter/instructor?instructor=${instructorId}`
      );
      return {
        courses: response.data.data,
        total: response.data.totalCount,
      };
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const initialState = {
  courses: [],
  currentCourse: null,
  loading: false,
  error: null,
  filteredCourses: [],
  total: 0,
  isFiltered: false,
  selectedCategory: null,
  selectedInstructor: null,
};

const courseSlice = createSlice({
  name: "courses",
  initialState,
  reducers: {
    clearCurrentCourse: (state) => {
      state.currentCourse = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    clearFilters: (state) => {
      state.filteredCourses = [];
      state.isFiltered = false;
      state.selectedCategory = null;
      state.selectedInstructor = null;
    },
    setSelectedCategory: (state, action) => {
      state.selectedCategory = action.payload;
    },
    setSelectedInstructor: (state, action) => {
      state.selectedInstructor = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCourses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCourses.fulfilled, (state, action) => {
        state.loading = false;
        state.courses = action.payload.courses;
        state.total = action.payload.total;
        state.error = null;
        state.isFiltered = false;
      })
      .addCase(fetchCourses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to fetch courses";
      })
      .addCase(fetchCourseById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCourseById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentCourse = action.payload;
      })
      .addCase(fetchCourseById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to fetch course";
      })
      .addCase(createCourse.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCourse.fulfilled, (state, action) => {
        state.loading = false;
        state.courses.push(action.payload);
        state.total += 1;
      })
      .addCase(createCourse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to create course";
      })
      .addCase(filterCoursesByCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(filterCoursesByCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.filteredCourses = action.payload.courses;
        state.total = action.payload.total;
        state.error = null;
        state.isFiltered = true;
      })
      .addCase(filterCoursesByCategory.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload?.message || "Failed to filter courses by category";
      })
      .addCase(filterCoursesByInstructor.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(filterCoursesByInstructor.fulfilled, (state, action) => {
        state.loading = false;
        state.filteredCourses = action.payload.courses;
        state.total = action.payload.total;
        state.error = null;
        state.isFiltered = true;
      })
      .addCase(filterCoursesByInstructor.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload?.message || "Failed to filter courses by instructor";
      });
  },
});

export const {
  clearCurrentCourse,
  clearError,
  clearFilters,
  setSelectedCategory,
  setSelectedInstructor,
} = courseSlice.actions;
export default courseSlice.reducer;
