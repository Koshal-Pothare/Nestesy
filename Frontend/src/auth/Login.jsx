import React ,{useState}from "react";
import { IoHomeOutline } from "react-icons/io5";
import { ShieldCheck, IndianRupee, Headphones ,Eye ,EyeOff,Lock,Mail,User} from "lucide-react";
import login from "../assets/login.png";
import {motion} from 'framer-motion'
import Swal from 'sweetalert2';
import { toast } from "react-toastify";
import {useNavigate} from "react-router-dom"

const Login = () => {

  const navigate= useNavigate();

    const[showPassword,setShowPassword]= useState(false);
    const[signUpform,setSignUpForm]= useState(false);

        const[loginData,setLoginData]=useState({
          email:"",
          password:""
        });

        const[signupData,setSignupData]= useState({
           username:"",
           email:"",
           password:"",
           cnfpassword:""
        })

        const[isAgreed,setIsAgreed] = useState(false);

        const handleLoginChange=(e)=>{
         setLoginData((prev)=>({
           ...prev,[e.target.name]:e.target.value,
         }))
        }

        const handleSignupChange=(e)=>{
          setSignupData((e)=>({
        ...prev,[e.target.name]:e.target.value,
          }))
        }

        

        const handleSignUp= async(e)=>{
           e.preventDefault();

           const{email,password,username,cnfpassword} = signupData;

           if(password !== cnfpassword) {
            toast.error("Password not matched");
            return;
           }

        const exsistingUser = JSON.parse(localStorage.getItem("nestesyUsers"));

        if(exsistingUser){
          if(

          exsistingUser.email.toLowerCase() === email.toLowerCase() ||
          exsistingUser.password.toLowerCase() === password.toLowerCase()
          ){
            toast.error("User already exists");
            return;
          } 
        }

        const user = {
          id: Date.now(),
          username,
          email,
          password,
           createdAt: new Date().toISOString(),

        };

        localStorage.setItem("nestesyUser" , JSON.stringify(user));

        await Swal.fire({
          title: "Signup Successful!",
          text: "Please login to continue",
          icon: "success",
          confirmButtonColor: "#1e3a5f",
        });
     
        
  setSignupData({
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  });

  setSignUpForm(false);

        }


        const handleLogin= async(e)=>{
         e,preventDefault();

const savedUser = JSON.parse(localStorage.getItem("nestesyUser"));
       
if(!savedUser){
  toast.error("User not found . Plz signUp first");
  return;
}

const enteredNameEmail = loginData.email.trim().toLowerCase();

const matchEmail = savedUser.email.toLowerCase()=== enteredNameEmail ;

const matchUserName = savedUser.username.toLowerCase() === enteredNameEmail ;

const matchPassword = savedUser.password=== loginData.password;

if((matchEmail || matchUserName) && matchPassword){
  const loggedInUser ={
    id: savedUser.id,
    name:savedUser.username,
    email:savedUser.email
  }

  localStorage.setItem("nestesyLoggedInUser",JSON.stringify(loggedInUser));


    await Swal.fire({
          title: "Signup Successful!",
          text: "Please login to continue",
          icon: "success",
          confirmButtonColor: "#1e3a5f",
        });
       


  setTimeout(() => {
      navigate("/user/dashboard");
    }, 500);
  }
  else {
    toast.error("Invalid email/username or password");
  }
}
        



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
            <div className="absolute inset-0 bg-linear-to-t from-primary-900/40 via-transparent to-transparent"></div>

            {/* Left Fade */}
            <div className="absolute inset-0 bg-linear-to-r from-primary-900/90 via-transparent to-transparent"></div>

             <div className="absolute top-0 left-0 w-full h-10 bg-linear-to-b from-primary-900 to-transparent" />
             <div className="absolute inset-0 bg-linear-to-b from-primary-900/50 via-transparent to-transparent"></div>
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
  className=" md:m-4"
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
        
        className="bg-white rounded-[28px] m-4 p-5 md:p-10 border-3 border-primary-600">
          <h1 
        
          className="text-3xl md:text-4xl font-serif font-semibold mt-5 md:mt-10 ">Login to <span className="text-primary-700  tracking-wider ">NESTESY</span></h1>
        <p className="mt-3 text-gray-600 tracking-wide text-md md:text-lg">Welcome back! Please enter your details</p>
         
         <form className=" py-5 md:py-10" onSubmit={handleLogin}>
            <div>
                <label htmlFor="email" className="block text-md md:text-lg font-semibold mt-6">
                    Email Address or Username
                </label>
               <div className="mt-2 flex items-center border border-gray-300 rounded-2xl px-5 h-12 md:h-15 focus-within:border-blue-500 transition-colors">
                    <Mail className="text-gray-400 shrink-0" />
                    <input
                      type="text"
                      name="email"
                     value={loginData.email}
                     onChange={handleLoginChange}
                      placeholder="name@company.com"
                     
                      required
                      className="w-full px-4 py-2 outline-none"
                    />
                  </div>

            </div>

            <div>
                <label htmlFor="password" className="block  text-md md:text-lg font-semibold mt-6">
                    Password
                </label>
                <div>
                <div className="mt-2 flex items-center border border-gray-300 rounded-2xl px-5  h-12 md:h-15 focus-within:border-blue-500 transition-colors">
                    <Lock className="text-gray-400 shrink-0" />
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      name="password"
                      value={loginData.password}
                      onChange={handleLoginChange}
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

            <div className="flex  justify-end mt-6">
           
               <button 
               type="button"
               onClick={()=>navigate("/forgot-password")}
               className="text-primary-500 hover:text-primary-600 font-semibold cursor-pointer text-md">
                    Forgot Password?
                </button>
            </div>
           

        <button 
        type="submit"
        className="w-full bg-primary-500 mt-6 md:mt-10 text-white py-3 md:py-4 text-lg md:text-xl font-semibold rounded-2xl hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-300 hover:scale-102">
            Login
        </button>

        <div className="mt-5 md:mt-10 flex items-center gap-2 justify-center text-center">
          <p className="w-25 h-px bg-primary-700"></p>
          <h1 className=" hidden md:block text-md text-gray-700 font-semibold ">or Continue with</h1>
          <h1 className="block md:hidden text-md text-gray-700 font-semibold ">or </h1>
          <p className="w-25 h-px bg-primary-700"></p>
        </div>

        <button className ="text-center w-full mt-5 md:mt-10 border-3 border-primary-700  py-3 md:py-4 rounded-2xl ">Continue with Google</button>

         </form>

         <p className="text-center text-gray-600  text-md md:text-lg  mt-3 md:mt-6">
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
      className="bg-white rounded-[28px] border-3 border-primary-600 p-5 md:p-10 absolute inset-0 h-full"
      style={{
        transform: "rotateY(180deg)",
        backfaceVisibility: "hidden",
        WebkitBackfaceVisibility: "hidden",
      }}
    >

      <h1 
        
          className=" text-3xl md:text-4xl font-serif font-semibold  ">SignUp to <span className="text-primary-700  tracking-wider ">NESTESY</span></h1>
        <p className="mt-3 text-gray-600 tracking-wide  text-md md:text-lg">Welcome to NESTESY! Please enter your details</p>
         
         <form className="py-4" onSubmit={handleSignUp}>

              <div>
                <label htmlFor="username" className="block text-md md:text-lg font-semibold mt-6">
                    Username
                </label>
               <div className="mt-2 flex items-center border border-gray-300 rounded-2xl px-5 h-12 md:h-15 focus-within:border-blue-500 transition-colors">
                    <User className="text-gray-400 shrink-0" />
                    <input
                      type="text"
                      name="username"
                     value={signupData.username}
                     onChange={handleSignupChange}
                      placeholder="Enter your username"
                     
                      required
                      className="w-full px-4 py-2 outline-none"
                    />
                  </div>

            </div>

            <div>
                <label htmlFor="email" className="block  text-md md:text-lg font-semibold mt-3">
                    Email Address
                </label>
               <div className="mt-2 flex items-center border border-gray-300 rounded-2xl px-5 h-12 md:h-15 focus-within:border-blue-500 transition-colors">
                    <Mail className="text-gray-400 shrink-0" />
                    <input
                      type="email"
                      name="Email"
                     vlaue={signupData.email}
                     onChange={handleSignupChange}
                      placeholder="name@company.com"
                     
                      required
                      className="w-full px-4 py-2 outline-none"
                    />
                  </div>

            </div>

             


            <div>
                <label htmlFor="password" className="block text-md md:text-lg font-semibold mt-3">
                    Password
                </label>
                
                <div className="mt-2 flex items-center border border-gray-300 rounded-2xl px-5 h-12 md:h-15 focus-within:border-blue-500 transition-colors">
                    <Lock className="text-gray-400 shrink-0" />
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      name="password"
                      value={signupData.password}
                    onChange={handleSignupChange}
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
                    <label htmlFor="password" className="block text-md md:text-lg font-semibold mt-3">
                   Confirm  Password
                </label>
                   <div className="mt-2 flex items-center border border-gray-300 rounded-2xl px-5 h-12  md:h-15 focus-within:border-blue-500 transition-colors">
                    <Lock className="text-gray-400 shrink-0" />
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      name="cnfpassword"
                      value={signupData.cnfpassword}
                    onChange={handleSignupChange}
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
    <div className="flex gap-3 mt-6">
              <input
                type="checkbox"
                checked={isAgreed}
                onChange={(e) => setIsAgreed(e.target.checked)}
                className="mt-0.5 w-4 h-4 accent-blue-600"
              />
              <p className="text-xs text-gray-500">
                I agree to the
                <span className="text-primary-600 font-semibold mx-1 cursor-pointer">Terms of Service</span>
                and
                <span className="text-primary-600 font-semibold ml-1 cursor-pointer">Privacy Policy</span>
              </p>
            </div>
         
           

        <button 
        type="submit"
        checked={isAgreed}
        className=
        {`w-full bg-primary-500 mt-5 text-white py-3 md:py-4 text-lg md:text-xl font-semibold rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-300 ${isAgreed ? "hover:bg-primary-600 hover:scale-105 cursor-pointer" : "disabled cursor-not-allowed"}`}>
            Sign Up
        </button>

        <div className="mt-3 flex items-center gap-2 justify-center text-center">
          <p className="w-25 h-px bg-primary-700"></p>
          <h1 className="text-[12px] text-gray-700 font-semibold ">or Continue with</h1>
          <p className="w-25 h-px bg-primary-700"></p>
        </div>

        <button className ="text-center w-full mt-3 border-3 border-primary-700 py-3 md:py-4 rounded-2xl ">Continue with Google</button>

         </form>

         <p className="text-center text-gray-600 text-md md:text-lg mt-2">
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