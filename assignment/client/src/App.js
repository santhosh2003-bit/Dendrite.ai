
import React from 'react';
import { BrowserRouter , Route, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';


import Whiteboard from "./components/Whiteboard";
import Home from './components/Home/Home';
import SignUp from './SignUp/SignUp';
import SignIn from './SignIn/SignIn';

const App= () => {
  return (
    <BrowserRouter>
      <Routes>
      <Route path='/' element={<Home/>}/>
      <Route path="/whiteboard" element={<Whiteboard/>} />
<Route path='/signup' element={<SignUp/>}/>
<Route path='signin' element={<SignIn/>}/>
        {/* Add more routes here */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;

