import React, { useState } from 'react';
import Login from '../features/auth/pages/Login';
import Register from '../features/auth/pages/Register';
import { RouterProvider } from 'react-router';
import { router } from './routes/app.routes';

const App = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div>
      <RouterProvider router={router} />
    </div>
  );
};

export default App;
