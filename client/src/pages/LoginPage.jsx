import React from 'react'
import { useForm } from 'react-hook-form'
import axios from 'axios'

function LoginPage() {

  const {register, handleSubmit} = useForm()
  const onSubmit = async (data) => {
    try {
      const response = await axios.post('http://localhost:5000/login', data, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
      if (response.status === 200) {
        console.log('Login successful')
      }
    } catch (error) {
      console.error(error, 'Login failed')
    }
  }

  return (
    <div className="w-10 h-10">
      <div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <input {...register("username")} />
          <input {...register("password")} />
          <input type="submit" />
        </form>
      </div>
    </div>
  )
}

export default LoginPage