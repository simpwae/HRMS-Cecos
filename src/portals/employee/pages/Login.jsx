import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../../state/auth';
import Button from '../../../components/Button';
import Card from '../../../components/Card';
import CECOSLogo from '../../../components/CECOSLogo';

export default function EmployeeLogin() {
  const [email, setEmail] = useState('demo@employee.com');
  const [password, setPassword] = useState('password');
  const navigate = useNavigate();
  const switchRole = useAuthStore((s) => s.switchRole);

  const handleLogin = (e) => {
    e.preventDefault();
    switchRole('employee');
    navigate('/employee');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-red-50 via-white to-amber-50">
      <Card className="w-full max-w-md">
        <div className="space-y-6">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <CECOSLogo variant="icon" size="lg" />
            </div>
            <h2 className="text-2xl font-bold text-[#800020]">CECOS University</h2>
            <h3 className="text-lg font-semibold text-gray-900 mt-1">Employee Portal</h3>
            <p className="mt-2 text-sm text-gray-600">Peshawar, Pakistan</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#001F3F] focus:ring-[#001F3F]"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#001F3F] focus:ring-[#001F3F]"
                required
              />
            </div>
            <Button type="submit" variant="primary" className="w-full">
              Sign In
            </Button>
          </form>
        </div>
      </Card>
    </div>
  );
}
