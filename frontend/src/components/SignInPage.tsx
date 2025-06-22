import * as React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

interface SignInPageProps {
  onSwitchToSignUp: () => void;
}
const SignInPage: React.FC<SignInPageProps> = ({ onSwitchToSignUp }) => {

    const router = useRouter();
    const [loginData, setLoginData] = React.useState({email: "", password: ""});

    const handleSignIn = async () => {
        const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(loginData)
        });

        const data = await res.json();    
        if (res.status === 200) {
            toast.success(data.message);
            router.push('/dashboard');            
        } else {
            toast.error(data.message);
        }
      };

  return (
    <motion.div
      key="signin"
      className="flex min-h-screen w-full items-center justify-center p-4 font-sans"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className="w-full rounded-2xl bg-white p-8 shadow-lg"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -20, opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="mb-8 text-center text-4xl font-semibold text-gray-800">
          Sign In
        </h1>

        <form onSubmit={(e) => {e.preventDefault(); handleSignIn();}}>
          <div className="mb-6">
            <label htmlFor="email" className="mb-2 block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <Input
              type="email"
              id="email"
              placeholder="Enter your email"
              onChange={(e) => setLoginData({...loginData, email: e.target.value})}
              className="w-full rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          <div className="mb-8">
            <label htmlFor="password" className="mb-2 block text-sm font-medium text-gray-700">
              Password
            </label>
            <Input
              type="password"
              id="password"
              placeholder="Enter your password"
              onChange={(e) => setLoginData({...loginData, password: e.target.value})}
              className="w-full rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          <Button
            type="submit"
            className="w-full rounded-lg bg-orange-500 py-3 text-lg font-semibold text-white transition-colors hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
          >
            Sign In
          </Button>
        </form>

        <div className="my-8 flex items-center">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="mx-4 text-gray-500">OR</span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>


        <p className="text-center text-gray-600">
          Don't have an account?{" "}
          <button
            type="button"
            onClick={onSwitchToSignUp}
            className="font-medium text-pink-600 hover:underline focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 rounded-md"
          >
            Sign up
          </button>
        </p>
      </motion.div>
    </motion.div>
  );
};

export default SignInPage;