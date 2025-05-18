import React, { useContext } from 'react'
import { Route, Routes } from 'react-router-dom'
import Start from './pages/Start'
import UserLogin from './pages/UserLogin'
import UserSignup from './pages/UserSignup'
import Home from './pages/Home'
import UserProtectWrapper from './pages/UserProtectWrapper'
import UserLogout from './pages/UserLogout'
import ProtectedRoute from './components/ProtectedRoute';
import ShortestPath from './pages/ShortestPath';
import 'remixicon/fonts/remixicon.css'

const App = () => {

  return (
    <div>
      <Routes>
        <Route path='/' element={<Start />} />
        <Route
          path="/shortest-path"
          element={
            <ProtectedRoute>
              <ShortestPath />
            </ProtectedRoute>
          }
        />
        <Route path='/login' element={<UserLogin />} />

        <Route path='/signup' element={<UserSignup />} />
        <Route path='/home'
          element={
            <UserProtectWrapper>
              <Home />
            </UserProtectWrapper>
          } />
        <Route path='/user/logout'
          element={<UserProtectWrapper>
            <UserLogout />
          </UserProtectWrapper>
          } />
      </Routes>
    </div>
  )
}

export default App