import {BrowserRouter,Routes,Route} from "react-router-dom"
import { AdminDashboard } from "./components/admin/AdminDashboard"
import AdminSignUp from "./components/admin/AdminSignup"
import AdminSignIn from "./components/admin/Adminsignin"
import { MainScreenMenu } from "./components/admin/MainScreenMenu"
import SignIn from "./components/user/Usersignin"
import SignUp from "./components/user/Usersignup"
import { ErrorPage } from "./components/common/ErrorPage"
import { MainScreenHome } from "./components/admin/MainScreenHome"
import './App.css'

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<SignUp></SignUp>}></Route>
          <Route path="/signin" element={<SignIn></SignIn>}></Route>
          <Route path="/admin/signup" element={<AdminSignUp></AdminSignUp>}></Route>
          <Route path="/admin/signin" element={<AdminSignIn></AdminSignIn>}></Route>
          <Route path="/admin/dashboard/" element={<MainScreenHome></MainScreenHome>}>
            <Route path="admin/dashboard/menu" element={<MainScreenMenu></MainScreenMenu>}></Route>
          </Route>
          <Route path="/admin/notfound" element={<ErrorPage link="/admin/signin"></ErrorPage>}></Route>
          <Route path="/user/notfound" element={<ErrorPage link="/signin"></ErrorPage>}></Route>
        </Routes>
      </BrowserRouter>
     
    </>
  )
}

export default App

