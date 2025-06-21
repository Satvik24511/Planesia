import * as React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

interface SignUpPageProps {
  onSwitchToSignIn: () => void;
}
const SignUpPage: React.FC<SignUpPageProps> = ({ onSwitchToSignIn }) => {

    const router = useRouter();
    const [signUpData, setSignUpData] = React.useState({email: "", password: "", retypePassword: "", name: ""});

    const handleSignIn = async () => {
        const res = await fetch('http://localhost:5000/api/auth/signup', {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(signUpData)
        });

        const data = await res.json();    
        if (res.status === 201) {
            toast.success(data.message);
            router.push('/dashboard');            
        } else {
            toast.error(data.message);
        }
      };

  return (
    <motion.div
      key="signup"
      className="flex min-h-screen items-center justify-center bg-gray-50 p-4 font-sans"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }} 
    >
      <motion.div
        className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -20, opacity: 0 }}
        transition={{ duration: 0.3 }} 
      >
        <h1 className="mb-8 text-center text-4xl font-semibold text-gray-800">
          Sign Up
        </h1>

        <form onSubmit={(e) => {e.preventDefault(); handleSignIn();}}>

            <div className="mb-6">
            <label htmlFor="username" className="mb-2 block text-sm font-medium text-gray-700">
              Username
            </label>
            <Input
              type="text"
              id="username"
              placeholder="Enter your username"
              onChange={(e) => setSignUpData({...signUpData, name: e.target.value})}
              className="w-full rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          <div className="mb-6">
            <label htmlFor="email" className="mb-2 block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <Input
              type="email"
              id="email"
              placeholder="Enter your email"
              onChange={(e) => setSignUpData({...signUpData, email: e.target.value})}
              className="w-full rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          <div className="mb-6">
            <label htmlFor="password" className="mb-2 block text-sm font-medium text-gray-700">
              Password
            </label>
            <Input
              type="password"
              id="password"
              placeholder="Enter your password"
              onChange={(e) => setSignUpData({...signUpData, password: e.target.value})}
              className="w-full rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          <div className="mb-8">
            <label htmlFor="retypePassword" className="mb-2 block text-sm font-medium text-gray-700">
              Retype Password
            </label>
            <Input
              type="password"
              id="retypePassword"
              placeholder="Retype your password"
              onChange={(e) => setSignUpData({...signUpData, retypePassword: e.target.value})}
              className="w-full rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          <Button
            type="submit"
            className="w-full rounded-lg bg-pink-400 py-3 text-lg font-semibold text-white transition-colors hover:bg-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2"
          >
            Sign Up
          </Button>
        </form>

        <div className="my-8 flex items-center">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="mx-4 text-gray-500">OR</span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>

        <p className="text-center text-gray-600">
          Already have an account?{" "}
          <button
            type="button"
            onClick={onSwitchToSignIn}
            className="font-medium text-indigo-600 hover:underline focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 rounded-md"
          >
            Sign in
          </button>
        </p>
      </motion.div>
    </motion.div>
  );
};

export default SignUpPage;
