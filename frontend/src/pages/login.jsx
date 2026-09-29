import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import Logo from "../assets/sujhavPeti.png";

function Login() {
//   const { login } = useAuth();
//   const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [msg, setMsg] = useState("");
  const [msgType, setMsgType] = useState("success"); //success or error
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
     setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
  }

    const handleSubmit = async(e) => {
        e.preventDefault();

        if(!formData.email.trim()||formData.password.trim())
        {
            setMsg("All fields are required.");
            setMsgType("error");
            return;
        }

        setMsg("Login Successful");
        setMsgType("success");
        //try{} catch
    };

  return (
    <div className="mainBg">
        <div className="flex items-center bg-[#033B79] justify-center size-full">
            <div className="flex items-stretch rounded-xl overflow-hidden">
                
                {/* Logo */}
                <div className="hidden md:flex bg-white/95 md:w-90 flex-col items-center justify-center text-center">
                    <img src={Logo} alt="Sujav Peti logo" className="w-80 h-auto -mt-8 object-contain"/>
                    <p className="text-md font-bold text-[#033B79]">
                        Your Suggestion is Our Priority
                    </p>
                </div>
                
                {/* Login Card */}
                <div className="py-10 px-8 bg-[#1268C2]  w-80 md:w-90">
                    
                    {/* Title */}
                    <h1 className=" text-center text-white mb-2 font-medium text-nowrap text-lg">Login Portal</h1>

                    {/* Form */}
                    <form 
                        className="text-[14.5px] space-y-4"
                        onSubmit={handleSubmit}   
                    >
                        <label className="label">
                            Email
                        </label>
                        <input
                            type="email"
                            required
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Enter your email"
                            className="inputBox"
                        />

                        <label className="label">
                            Password
                        </label>
                        <div className="flex items-center justify-between gap-1 passwordBox">
                            <input 
                                type={showPassword ? "text" : "password"} 
                                name='password'
                                value= {formData.password}
                                onChange={handleChange}
                                placeholder="Enter your password"
                                className="h-8 outline-none w-full"
                            />
                            <button
                            type="button"
                            title={showPassword ? "Hide Password" : "Show Password"}
                            onClick={()=>setShowPassword(prev => !prev)}
                            >
                                {showPassword
                                    ?<EyeOff className="h-4.5 w-4.5 text-black/70"/>
                                    :<Eye className="h-4.5 w-4.5 text-black/70"/>
                                }
                            </button>
                        </div>
                        
                        <div className="flex justify-center w-full">
                            <button 
                                className="button bg-[#ff9c09] shadow-md text-white hover:bg-[#fc9904]/95" 
                                type="submit" 
                                disabled={submitting}
                            >
                                {submitting ? "Signing in..." : "Sign in"}
                            </button>
                        </div>

                        {msg && 
                            <p className={`mt-2 font-medium rounded-md text-center px-3 py-1.5
                                ${msgType==='success'
                                    ?"text-black/70 bg-white/95"
                                    :"text-red-600 bg-white/95"}`}
                            >
                                {msg}
                            </p>
                        }
                    </form>

                    {/* Option */}
                    <div className="w-full flex flex-col items-center">
                        <div className="flex my-5 items-center w-65 gap-2">
                            <div className="h-0.5 w-full bg-white/70"></div>
                            <h1 className=" text-white font-medium text-nowrap">OR</h1>
                            <div className="h-0.5 w-full bg-white/70"></div>
                        </div>
                        
                        <p className="text-sm text-white/80"> 
                            Don't have an account? <Link to="/register" className="text-white">Register Now</Link>
                        </p>
                    </div>

                </div>
            </div>
        </div>
    </div>
  );
}

export default Login;