import { BrowserRouter,Routes,Route } from 'react-router-dom'
import './App.css'
import SignUp from './components/mui/user/Usersignup';
import SignIn from './components/mui/user/Usersignin';
function App() {
  return ( 
     <div>
         <BrowserRouter>
         <Routes>
          <Route path="/signup" element={<SignUp></SignUp>}></Route>
          <Route path="/signin" element={<SignIn></SignIn>}></Route>
         </Routes>
         </BrowserRouter>
     </div>

  )
}

export default App;
