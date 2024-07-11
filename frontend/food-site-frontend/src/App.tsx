import { BrowserRouter,Routes,Route } from 'react-router-dom'
import './App.css'
import UserSignup from "./components/UserSignup"
function App() {
  return ( 
     <div>
         <BrowserRouter>
         <Routes>
          <Route path="/" element={<UserSignup></UserSignup>}></Route>
         </Routes>
         </BrowserRouter>
     </div>

  )
}

export default App;
