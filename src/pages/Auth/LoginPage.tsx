import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useForm } from 'react-hook-form'
import { Eye, EyeOff, Mail, Lock } from 'lucide-react'
import { RootState } from '../../store/store'
import { login } from '../../store/slices/authSlice'
import toast from 'react-hot-toast'

interface LoginForm {
  email: string
  password: string
}

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { isLoading, error } = useSelector((state: RootState) => state.auth)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>()

  const onSubmit = async (data: LoginForm) => {
    try {
      await dispatch(login(data) as any)
      toast.success('Welcome back!')
      navigate('/dashboard')
    } catch (err) {
      toast.error('Login failed. Please try again.')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#313338] py-8 sm:py-12 px-4 sm:px-6 lg:px-8 pt-32 sm:pt-36">
      <div className="max-w-md w-full space-y-6 sm:space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-center text-2xl sm:text-3xl font-extrabold text-[#F2F3F5]">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm sm:text-base text-[#949BA4]">
            Or{' '}
            <Link to="/register" className="font-medium text-[#5865F2] hover:text-[#4752C4] touch-manipulation discord-focus">
              create a new account
            </Link>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4 sm:space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm sm:text-base font-medium text-[#F2F3F5]">
                Email address
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-[#949BA4]" />
                </div>
                <input
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address',
                    },
                  })}
                  type="email"
                  className="input-field pl-10 text-base"
                  placeholder="Enter your email"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-[#ED4245]">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm sm:text-base font-medium text-[#F2F3F5]">
                Password
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-[#949BA4]" />
                </div>
                <input
                  {...register('password', {
                    required: 'Password is required',
                    minLength: {
                      value: 6,
                      message: 'Password must be at least 6 characters',
                    },
                  })}
                  type={showPassword ? 'text' : 'password'}
                  className="input-field pl-10 pr-12 text-base"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center touch-manipulation discord-focus"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-[#949BA4]" />
                  ) : (
                    <Eye className="h-5 w-5 text-[#949BA4]" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-[#ED4245]">{errors.password.message}</p>
              )}
            </div>
          </div>

          {error && (
            <div className="bg-[#ED4245]/10 border border-[#ED4245]/20 text-[#ED4245] px-4 py-3 rounded-md text-sm">
              {error}
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full flex justify-center py-3 text-base font-medium touch-manipulation discord-hover"
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>

          <div className="text-center">
            <Link to="/forgot-password" className="text-sm text-[#5865F2] hover:text-[#4752C4] touch-manipulation discord-focus">
              Forgot your password?
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}

export default LoginPage 