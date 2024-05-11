import "./App.css";
import { Route,Routes } from "react-router-dom";
import Home from "./pages/Home";
import Footer from "./components/common/Footer";
import Navbar from "./components/common/Navbar";
import OpenRoute from "./components/core/Auth/OpenRoute";
import Login from "./pages/Login"
import Signup from "./pages/Signup"
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import { setProgress } from "./slices/loadingBarSlice";
import VerifyOtp from "./pages/VerifyOtp";
import About from "./pages/About";
import ContactUs from "./pages/ContactUs";
import Dashboard from "./pages/Dashboard";
import MyProfile from "./components/core/Dasboard/MyProfile";
import PrivateRoute from "./components/core/Auth/PrivateRoute";
import Settings from "./components/core/Dasboard/Settings";
import EnrollledCourses from "./components/core/Dasboard/EnrolledCourses";
import Cart from './components/core/Dasboard/Cart/index'
import { ACCOUNT_TYPE } from "./utils/constants";
import { useSelector } from "react-redux";
import MyCourses from "./components/core/Dasboard/MyCourses/MyCourses";
import AddCourse from "./components/core/Dasboard/AddCourse";
import Catalog from "./pages/Catalog";

function App() {
  const user= useSelector((state)=>state.profile.user)
  return (
   <div className="w-screen min-h-screen bg-richblack-900 flex flex-col font-inter">
    <Navbar setProgress={setProgress}/>
    <Routes>
      <Route path="/" element={<Home/>} />
      <Route path="/catalog/:catalog" element={<Catalog />} />
      <Route
          path="/login"
          element={
            <OpenRoute>
              <Login />
            </OpenRoute>
          }
      />

      <Route
          path="/signup"
          element={
            <OpenRoute>
              <Signup />
            </OpenRoute>
          }
      />
      <Route
          path="/forgot-password"
          element={
           <ForgotPassword />
          }
      />
      <Route path="/update-password/:id" element={<ResetPassword />} />

      <Route path="/verify-email" element={<VerifyOtp />} />

      <Route
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        >
          <Route path="dashboard/my-profile" element={<MyProfile />} />
          <Route path="dashboard/settings" element={<Settings />} />
          {user?.accountType === ACCOUNT_TYPE.STUDENT && (
            <>
              <Route path="dashboard/cart" element={<Cart />} />
              <Route
                path="dashboard/enrolled-courses"
                element={<EnrollledCourses />}
              />
              {/* <Route
                path="dashboard/purchase-history"
                element={<PurchaseHistory />}
              /> */}
            </>
          )}

{user?.accountType === ACCOUNT_TYPE.INSTRUCTOR && (
            <>
              <Route path="dashboard/add-course" element={<AddCourse />} />
              <Route path="dashboard/my-courses" element={<MyCourses />} />
              {/* <Route
                path="dashboard/edit-course/:courseId"
                element={<EditCourse />}
              /> */}
              {/* <Route
                path="dashboard/instructor"
                element={<InstructorDashboard />}
              /> */}
            </>
          )}

      </Route>



      
      <Route path="/about" element={<About/>}/>
      <Route path="/contact" element={<ContactUs />} />


    </Routes>
    <Footer />
   </div>
  );
}

export default App;
 