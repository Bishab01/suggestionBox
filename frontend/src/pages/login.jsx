import { useState } from "react";
import { Link, useNavigate, Navigate } from "react-router-dom";
import { Eye, EyeOff, LogIn } from "lucide-react";
import Logo from "../assets/sujhavPeti.png";
import { useAuth } from "../context/authContext";
import api from "../api/axios";

function Login() {
    const { setUser, user, loading } = useAuth();
    const navigate = useNavigate();
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

        if(!formData.email.trim()||!formData.password.trim())
        {
            setMsg("All fields are required.");
            setMsgType("error");
            return;
        }

        setSubmitting(true);
        setMsg("");
        try {
            const response = await api.post("login.php", {
                email: formData.email.trim(),
                password: formData.password
            });

            if(!response.data.success){
                setMsg(response.data.message);
                setMsgType("error");
                return;
            }

            setMsg(response.data.message);
            setMsgType("success");

            // Short pause so the success message is visible, then save the user
            // in the auth context and go to the role based landing page
            const loggedIn = response.data.user;
            setTimeout(() => {
                setUser(loggedIn);
                navigate(loggedIn.role === "admin" ? "/admin/dashboard" : "/home", { replace: true });
            }, 1200);

        } catch (error) {
            setMsg(
                error.response
                    ? error.response.data?.message || "Login failed."
                    : "Cannot reach the server. Please try again."
            );
            setMsgType("error");
        } finally {
            setSubmitting(false);
        }
    };

    // Already logged in (e.g. opened /login again): skip the form.
    if (!loading && user) {
        return <Navigate to={user.role === "admin" ? "/admin/dashboard" : "/home"} replace />;
    }

    return (
        <div className="mainBg">
            <div className="flex items-center bg-[#023166]  justify-center size-full overflow-y-auto">
                <div className="flex items-stretch rounded-xl mx-2 overflow-hidden">
                    
                    {/* Logo */}
                    <div className="hidden md:flex bg-white/95 md:w-90 flex-col items-center justify-center text-center">
                        <img src={Logo} alt="Sujav Peti logo" className="w-80 h-auto -mt-8 object-contain shrink-0"/>
                        <p className="text-md font-bold text-[#033B79]">
                            Your Suggestion is Our Priority
                        </p>
                    </div>
                    
                    {/* Login Card */}
                    <div className="py-10 px-8 bg-[#1a73d3] w-85 md:w-90">
                        {/* logo when less than md */}
                        <div className="md:hidden w-full flex items-center justify-center">
                            <div className="flex items-center justify-center rounded-full size-30 bg-white/95 overflow-hidden border-2 border-[#ff9c09]">
                                <img src={Logo} alt="Sujav Peti logo" className="size-full -mt-3 object-contain shrink-0"/>
                            </div>
                        </div>
                        
                        {/* Title */}
                        <div className="md:hidden w-full flex flex-col items-center">
                            <div className="flex my-5 items-center w-65 gap-2">
                                <div className="h-0.5 w-full bg-white/70"></div>
                                <h1 className=" text-white font-medium text-lg text-nowrap">Log in</h1>
                                <div className="h-0.5 w-full bg-white/70"></div>
                            </div>
                        </div>

                        <h1 className="hidden md:block text-center text-white mb-2 font-medium text-nowrap text-lg">
                            Login Portal
                        </h1>

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
                                    required
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

                            {msg && (
                                <p
                                    className={`my-5 font-medium rounded-md text-center px-3 py-1 border
                                        ${
                                            msgType === "success"
                                                ? "text-green-700 bg-white/95 border-green-300"
                                                : "text-red-600 bg-white/95 border-red-300"
                                        }`}
                                >
                                    {msg}
                                </p>
                            )}
                            
                            <div className="flex justify-center w-full">
                                <button 
                                    className="button bg-[#ff9c09] shadow-md text-white hover:bg-[#fc9904]/95" 
                                    type="submit" 
                                    disabled={submitting}
                                >
                                    {submitting ? "Signing in..." : 
                                        <div className="flex items-center justify-center gap-2">
                                            <LogIn className="size-5 shrink-0"/>
                                            <span>Sign in</span> 
                                        </div>
                                    }
                                </button>
                            </div>

                        </form>

                        {/* Option */}
                        <div className="w-full flex flex-col items-center">
                            <div className="flex my-5 items-center w-65 gap-2">
                                <div className="h-0.5 w-full bg-white/70"></div>
                                <h1 className=" text-white font-medium text-nowrap">OR</h1>
                                <div className="h-0.5 w-full bg-white/70"></div>
                            </div>
                            
                            <p className="text-sm text-white/80"> 
                                Don't have an account? <Link to="/register" className="text-white underline">Register Now</Link>
                            </p>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;