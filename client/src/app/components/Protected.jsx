import React, { useEffect } from 'react'
import { useAuth } from '../../features/auth/hooks/useAuth.js'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router'

const Protected = ({children}) => {
    const navigate = useNavigate()
    const {handleGetMe} = useAuth()
    const {user} = useSelector(state => state.auth)
    
    useEffect(() => {
        const verifyUser = async () => {
            const isAuthenticated = await handleGetMe()
            if (!isAuthenticated) {
                navigate("/login")
            }
        }
        verifyUser()
    }, [])

  return (
    <>
        {user ? children : null}
    </>
  )
}

export default Protected
