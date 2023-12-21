import useAuth from '@src/hooks/useAuth'
import {Link} from "react-router-dom"
import React from 'react'

export default function About() {
    const {user} = useAuth();
  return (
    <div>About
        <Link to="/" >Home</Link>
    </div>
  )
}
