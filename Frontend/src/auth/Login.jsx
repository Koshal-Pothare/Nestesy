import React ,{useState}from "react";
import { IoHomeOutline } from "react-icons/io5";
import { ShieldCheck, IndianRupee, Headphones ,Eye ,EyeOff,Lock,Mail} from "lucide-react";
import login from "../assets/login.png";
import {motion} from 'framer-motion'

const Login = () => {

    const[showPassword,setShowPassword]= useState(false);
    const[signUpform,setSignUpForm]= useState(false);



  return (
    <div className=" bg-[#F7F7F5] flex items-center justify-center p-2 md:p-8">
      <div className="w-full max-w-[1250px] md:bg-primary-900 rounded-[32px]  overflow-hidden grid grid-cols-1 lg:grid-cols-2">

        {/* Left Side */}
        <div className="relative hidden md:flex flex-col justify-between p-10">

          {/* Background Glow */}
          <div className="absolute -top-28 -left-24 h-72 w-72 rounded-full bg-primary-700/20 blur-3xl"></div>

          {/* Content */}
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-20">
              <IoHomeOutline size={38} className="text-green-400" />
              <h1 className="text-4xl font-serif text-white tracking-widest">
                NESTESY
              </h1>
            </div>

            <h1 className="text-5xl font-serif text-white leading-tight">
              Welcome back!
            </h1>

            <h1 className="text-5xl font-serif leading-tight">
              <span className="text-white">Glad to see you,</span>
             
            </h1>

            <p className="text-white/80 mt-6 leading-8 max-w-md">
             Login to your account and explore the world, of trusted stays<br/> and happy living. <br/>Find a home that feels like yours with {" "}
              <span className="text-green-400 font-serif tracking-widest">
                NESTESY
              </span>
              .
            </p>
          </div>

          {/* Image */}
          <div className="relative mt-10 h-[400px] overflow-hidden w-full">
            <img
              src={login}
              alt="Living Room"
              className="w-full h-full object-cover object-center"
            />

            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-primary-900/40 via-transparent to-transparent"></div>

            {/* Left Fade */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary-900/90 via-transparent to-transparent"></div>

             <div className="absolute top-0 left-0 w-full h-10 bg-gradient-to-b from-primary-900 to-transparent" />
             <div className="absolute inset-0 bg-gradient-to-b from-primary-900/50 via-transparent to-transparent"></div>
          </div>


          {/* Bottom Features */}
          <div className="grid grid-cols-3 gap-6 border-t border-white/10 pt-6">

            <div className="text-center">
              <ShieldCheck
                className="mx-auto text-green-400"
                size={28}
              />
              <h3 className="text-white mt-3 font-medium">
                Verified
              </h3>
              <p className="text-white/60 text-xs mt-1">
                Trusted Stays
              </p>
            </div>

            <div className="text-center">
              <IndianRupee
                className="mx-auto text-green-400"
                size={28}
              />
              <h3 className="text-white mt-3 font-medium">
                Best Value
              </h3>
              <p className="text-white/60 text-xs mt-1">
                Affordable Prices
              </p>
            </div>

            <div className="text-center">
              <Headphones
                className="mx-auto text-green-400"
                size={28}
              />
              <h3 className="text-white mt-3 font-medium">
                24/7 Support
              </h3>
              <p className="text-white/60 text-xs mt-1">
                Always Available
              </p>
            </div>

          </div>
        </div>

        {/* Right Side */}

        <div
  className="m-4"
  style={{
    perspective: "1500px",
  }}
>
      <motion.div 
       animate={{
      rotateY: signUpform ? 180 : 0,
    }}
    transition={{
      duration: 0.8,
      ease: "easeInOut",
    }}
    style={{
      transformStyle: "preserve-3d",
      position: "relative",
      minHeight: "850px",
    }}
      
      >
        {/* login form  */}

        <div
          style={{
        backfaceVisibility: "hidden",
        WebkitBackfaceVisibility: "hidden",
      }}
        
        className="bg-white rounded-[28px] m-4 p-10 border-3 border-primary-600">
          <h1 
        
          className="text-4xl font-serif font-semibold mt-10 ">Login to <span className="text-primary-700  tracking-wider ">NESTESY</span></h1>
        <p className="mt-3 text-gray-600 tracking-wide text-lg">Welcome back! Please enter your details</p>
         
         <form className="py-10">
            <div>
                <label htmlFor="email" className="block text-lg font-semibold mt-6">
                    Email Address or Username
                </label>
               <div className="mt-2 flex items-center border border-gray-300 rounded-2xl px-5  h-15 focus-within:border-blue-500 transition-colors">
                    <Mail className="text-gray-400 shrink-0" />
                    <input
                      type={"email" || "text"}
                      name={"Email" || "Username"}
                     
                      placeholder="name@company.com"
                     
                      required
                      className="w-full px-4 py-2 outline-none"
                    />
                  </div>

            </div>

            <div>
                <label htmlFor="password" className="block text-lg font-semibold mt-6">
                    Password
                </label>
                <div>
                <div className="mt-2 flex items-center border border-gray-300 rounded-2xl px-5 h-15 focus-within:border-blue-500 transition-colors">
                    <Lock className="text-gray-400 shrink-0" />
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      name="Password"
                    
                      required
                      className="w-full px-4  outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-gray-400 hover:text-gray-600 transition-colors shrink-0"
                    >
                      {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                    </button>
                  </div>
                </div>

            </div>

            <div className="flex items-center justify-between mt-6">
               <h1 className="flex items-center gap-2"><input type="checkbox" className=" h-5 w-5 border border-primary-900" />Remember Me</h1>
               <button className="text-primary-500 hover:text-primary-600 font-semibold cursor-pointer">
                    Forgot Password?
                </button>
            </div>
           

        <button className="w-full bg-primary-500 mt-10 text-white py-4 text-xl font-semibold rounded-2xl hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-300 hover:scale-102">
            Login
        </button>

        <div className="mt-10 flex items-center gap-2 justify-center text-center">
          <p className="w-25 h-px bg-primary-700"></p>
          <h1 className="text-md text-gray-700 font-semibold ">or Continue with</h1>
          <p className="w-25 h-px bg-primary-700"></p>
        </div>

        <button className ="text-center w-full mt-10 border-3 border-primary-700 py-4 rounded-2xl ">Continue with Google</button>

         </form>

         <p className="text-center text-gray-600 text-lg mt-6">
           Don't have an account?{' '}
           <button 
           type="button"
           onClick={() => setSignUpForm(true)}
           className="text-primary-500 hover:text-primary-600 font-semibold cursor-pointer">
             Sign up
           </button>
         </p>
        </div>

      

{/* sign up  */}
 <div
      className="bg-white rounded-[28px] border-3 border-primary-600 p-10 absolute inset-0 h-[900px]"
      style={{
        transform: "rotateY(180deg)",
        backfaceVisibility: "hidden",
        WebkitBackfaceVisibility: "hidden",
      }}
    >

      <h1 
        
          className="text-4xl font-serif font-semibold  ">SignUp to <span className="text-primary-700  tracking-wider ">NESTESY</span></h1>
        <p className="mt-3 text-gray-600 tracking-wide text-lg">Welcome to NESTESY! Please enter your details</p>
         
         <form className="py-4">
            <div>
                <label htmlFor="email" className="block text-lg font-semibold mt-3">
                    Email Address
                </label>
               <div className="mt-2 flex items-center border border-gray-300 rounded-2xl px-5  h-15 focus-within:border-blue-500 transition-colors">
                    <Mail className="text-gray-400 shrink-0" />
                    <input
                      type="email"
                      name="Email"
                     
                      placeholder="name@company.com"
                     
                      required
                      className="w-full px-4 py-2 outline-none"
                    />
                  </div>

            </div>

             <div>
                <label htmlFor="username" className="block text-lg font-semibold mt-6">
                    Username
                </label>
               <div className="mt-2 flex items-center border border-gray-300 rounded-2xl px-5  h-15 focus-within:border-blue-500 transition-colors">
                    <Mail className="text-gray-400 shrink-0" />
                    <input
                      type="text"
                      name="Username"
                     
                      placeholder="Enter your username"
                     
                      required
                      className="w-full px-4 py-2 outline-none"
                    />
                  </div>

            </div>


            <div>
                <label htmlFor="password" className="block text-lg font-semibold mt-6">
                    Password
                </label>
                
                <div className="mt-2 flex items-center border border-gray-300 rounded-2xl px-5 h-15 focus-within:border-blue-500 transition-colors">
                    <Lock className="text-gray-400 shrink-0" />
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      name="Password"
                    
                      required
                      className="w-full px-4  outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-gray-400 hover:text-gray-600 transition-colors shrink-0"
                    >
                      {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                    </button>
                  </div>

                  {/* confirm password */}
                  <div>
                    <label htmlFor="password" className="block text-lg font-semibold mt-6">
                   Confirm  Password
                </label>
                   <div className="mt-2 flex items-center border border-gray-300 rounded-2xl px-5 h-15 focus-within:border-blue-500 transition-colors">
                    <Lock className="text-gray-400 shrink-0" />
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      name="Password"
                    
                      required
                      className="w-full px-4  outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-gray-400 hover:text-gray-600 transition-colors shrink-0"
                    >
                      {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                    </button>
                  </div>
                  </div>


                

            </div>

         
           

        <button className="w-full bg-primary-500 mt-5 text-white py-4 text-xl font-semibold rounded-2xl hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-300 hover:scale-102">
            Sign Up
        </button>

        <div className="mt-5 flex items-center gap-2 justify-center text-center">
          <p className="w-25 h-px bg-primary-700"></p>
          <h1 className="text-md text-gray-700 font-semibold ">or Continue with</h1>
          <p className="w-25 h-px bg-primary-700"></p>
        </div>

        <button className ="text-center w-full mt-5 border-3 border-primary-700 py-4 rounded-2xl ">Continue with Google</button>

         </form>

         <p className="text-center text-gray-600 text-lg mt-3">
           Already have an Account ?{' '}
           <button 
           type="button"
           onClick={() => setSignUpForm(false)}
           className="text-primary-500 hover:text-primary-600 font-semibold cursor-pointer ">
             Login
           </button>
         </p>
        </div>
      


</motion.div>


      </div>


      </div>
    </div>
  );
};

export default Login;