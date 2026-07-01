import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<div className="p-4">Enterprise Workforce Platform Setup</div>} />
        <Route path="/login" element={<div className="p-4">Login Page</div>} />
        {/* Protected routes will go here */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
