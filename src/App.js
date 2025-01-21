
import './App.css';

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/home';
import About from './pages/about';

function App() {
  
  return (
    <BrowserRouter>
      <Routes>
        <Route>
          <Route path='/' element={<Home />} />
          <Route path="/about" element={<About />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
export default App;
