import { BrowserRouter,Routes,Route } from 'react-router-dom'
import './App.css'
import SignUp from './components/mui/user/Usersignup';
import SignIn from './components/mui/user/Usersignin';
import AdminSignUp from './components/mui/admin/AdminSignup';
import AdminSignIn from './components/mui/admin/Adminsignin';
function App() {
  return ( 
     <div>
         <BrowserRouter>
         <Routes>
          <Route path="/signup" element={<SignUp></SignUp>}></Route>
          <Route path="/signin" element={<SignIn></SignIn>}></Route>
          <Route path="/admin/signup" element={<AdminSignUp></AdminSignUp>}></Route>
          <Route path="/admin/signin" element={<AdminSignIn></AdminSignIn>}></Route>
         </Routes>
         </BrowserRouter>
     </div>

  )
}

export default App;
