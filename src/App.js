
import './App.css';

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/home';
import About from './pages/about';
import Foods from './pages/food';
import Dish from './components/Dish';
import Report from './components/Report';

function App() {
  
  return (
    <BrowserRouter>
      <Routes>
        <Route>
          <Route path='/' element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path='/foods' element={<Foods />}/>
          <Route path='/foods/:id' element={<Dish />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
export default App;
