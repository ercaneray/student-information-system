import React from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router'
import { useAuthStore } from '../store/authStore'

function LoginPage() {

  const navigate = useNavigate()
  const login = useAuthStore((state) => state.login);
  const isLoading = useAuthStore((state) => state.isLoading);
  const { register, handleSubmit } = useForm()
  const onSubmit = async (data) => {
    try {
      await login(data.UserID, data.Password)
      navigate('/dashboard')
    } catch (error) {
      console.error(error)
    }

  }

  return (
    <div className='flex items-center justify-center min-h-screen bg-gray-100'>
      <div className='w-full max-w-md p-8 bg-white rounded-lg shadow-lg'>
        <h2 className='text-2xl font-bold text-center text-gray-800 mb-6'>OBS Girişi</h2>
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
          <button type="submit" disabled={isLoading} className='w-full px-4 py-2 text-white bg-emerald-400 hover:bg-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:ring-opacity-75 rounded-lg shadow-md'>
            {isLoading ? 'Giriş Yapılıyor...' : 'Giriş Yap'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default LoginPage