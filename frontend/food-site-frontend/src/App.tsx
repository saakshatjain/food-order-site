import { BrowserRouter,Routes,Route } from 'react-router-dom'
import './App.css'
import SignUp from './components/user/Usersignup';
import SignIn from './components/user/Usersignin';
import AdminSignUp from './components/admin/AdminSignup';
import AdminSignIn from './components/admin/Adminsignin';
import AdminDashboard from './components/admin/AdminDashboard';
function App() {
  return ( 
     <div>
         <BrowserRouter>
         <Routes>
          <Route path="/signup" element={<SignUp></SignUp>}></Route>
          <Route path="/signin" element={<SignIn></SignIn>}></Route>
          <Route path="/admin/signup" element={<AdminSignUp></AdminSignUp>}></Route>
          <Route path="/admin/signin" element={<AdminSignIn></AdminSignIn>}></Route>
          <Route path="/admin/dashboard" element={<AdminDashboard></AdminDashboard>}></Route>
         </Routes>
         </BrowserRouter>
     </div>

  )
}

export default App;
