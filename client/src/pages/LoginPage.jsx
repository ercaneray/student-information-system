import React from 'react'
import { useForm } from 'react-hook-form'
import axios from 'axios'
import { useNavigate } from 'react-router'
import useSignIn from 'react-auth-kit/hooks/useSignIn';
import useAuthUser from 'react-auth-kit/hooks/useAuthUser';

function LoginPage() {

  const navigate = useNavigate()
  const { register, handleSubmit } = useForm()
  const signIn = useSignIn()
  const onSubmit = async (data) => {
    try {
      const response = await axios.post('http://localhost:5000/auth/login', data, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
      if (response.status === 200) {
        console.log(data.UserID)
        console.log(data)

        signIn({
          auth: {
            token: 'dummy token',
            userID: data.UserID,
          }
        });
        alert('Login successful')
      }
    } catch (error) {
      console.error(error, 'Login failed')
    }
  }

  const user = useAuthUser();
  console.log(user)

  return (
    <div className='flex items-center justify-center min-h-screen bg-gray-100'>
      <div className='w-full max-w-md p-8 bg-white rounded-lg shadow-lg'>
        <h2 className='text-2xl font-bold text-center text-gray-800 mb-6'>OBS Öğrenci Girişi</h2>
        <form className='space-y-9' onSubmit={handleSubmit(onSubmit)} >
          <input
            {...register("UserID")}
            type='text'
            placeholder='Öğrenci No'
            className='w-full px-4 py-2 border rounded-lg border-gray-300'
          />
          <input
            {...register("Password")}
            type='password'
            placeholder='Şifre'
            className='w-full px-4 py-2 border rounded-lg border-gray-300'
          />
          <input type="submit" className='w-full px-4 py-2 text-white bg-emerald-400 hover:bg-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:ring-opacity-75 rounded-lg shadow-md' />
        </form>
      </div>
    </div>
  )
}

export default LoginPage