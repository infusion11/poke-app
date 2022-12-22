import './App.css';
import Types from './components/typeslist/types';
import Profile from './components/profilecard/profile';
import { Routes, Route } from 'react-router-dom';

function App() {
  return (

    <div className="App">
      <Routes>
        <Route path="/" element={<Types />} />
        <Route path="/profile/:name" element={<Profile />} />
      </Routes>
    </div>
  );
}

export default App;
