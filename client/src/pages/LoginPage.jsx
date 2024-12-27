// Klasik login sayfası

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';
import { useAuthStore } from '../store/authStore';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { FloatLabel } from 'primereact/floatlabel';
import 'primereact/resources/themes/saga-blue/theme.css'; // Tema
import 'primereact/resources/primereact.min.css'; // PrimeReact CSS
import 'primeicons/primeicons.css'; // PrimeReact ikonlar

function LoginPage() {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const isLoading = useAuthStore((state) => state.isLoading);
  const [error, setError] = useState('');
  const { register, handleSubmit, setValue, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    try {
      await login(data.UserID, data.Password);
      navigate('/info');
    } catch (err) {
      setError('Hatalı kullanıcı numarası veya şifre.');
      console.error(err);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">OBS Giriş</h2>
        
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          {/* FloatLabel for UserID */}
          <FloatLabel>
            <InputText
              id="UserID"
              {...register("UserID", { required: 'Kullanıcı ID giriniz.' })}
              className={"w-full h-14 text-lg px-4 border-gray-300 rounded-lg"}
              onChange={(e) => setValue("UserID", e.target.value)}
            />
            <label htmlFor="UserID">Öğrenci, Admin veya Eğitmen No</label>
          </FloatLabel>
          {errors.UserID && <small className="p-error">{errors.UserID.message}</small>}

          {/* FloatLabel for Password */}
          <FloatLabel>
            <InputText
              id="Password"
              {...register("Password", { required: 'Şifre giriniz.' })}
              className={"w-full h-14 text-lg px-4 border-gray-300 rounded-lg"}
              onChange={(e) => setValue("Password", e.target.value)}
              feedback="false" // Şifre gücü geri bildirimi kapalı
              type='password'
            />
            <label htmlFor="Password">Şifre</label>
          </FloatLabel>
          {errors.Password && <small className="p-error">{errors.Password.message}</small>}

          {/* Submit Button */}
          <Button
            label={isLoading ? 'Giriş Yapılıyor...' : 'Giriş Yap'}
            className="w-full bg-blue-400 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-xl focus:outline-none focus:shadow-outline"
            type="submit"
            disabled={isLoading}
          />
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
