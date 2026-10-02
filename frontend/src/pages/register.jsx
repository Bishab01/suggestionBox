import { useState } from "react";
import { Link, useNavigate} from "react-router-dom";
import { Eye, EyeOff, UserPlus } from "lucide-react";
import api from "../api/axios";

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fname: "",
    lname: "",
    email: "",
    password: ""
  });
  const [msg, setMsg] = useState("");
  const [msgType, setMsgType] = useState("success"); //success or error
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const nameRegex = /^[a-zA-Z]+$/;

  const handleChange = (e) => {
     setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
  }

    const handleSubmit = async(e) => {
        e.preventDefault();

        if (!nameRegex.test(formData.fname)) {
            setMsg("First name must contain only letters.");
            setMsgType("error");
            return;
        }

        if (!nameRegex.test(formData.lname)) {
            setMsg("Last name must contain only letters.");
            setMsgType("error");
            return;
        }

        if (formData.password.length < 8) {
            setMsg("Password must be at least 8 characters.");
            setMsgType("error");
            return;
        }

        setSubmitting(true);
        setMsg("");
        try {
            const response = await api.post("register.php", formData);

            if(!response.data.success){
                setMsg(response.data.message);
                setMsgType("error");
                return;
            }

            setMsg(response.data.message);
            setMsgType("success");
            
            setFormData({
                fname: "",
                lname: "",
                email: "",
                password: ""
            });

            // Short pause so the success message is visible, then go to login
            setTimeout(() => {
                navigate("/login");
            }, 1200);

        } catch (error) {
            setMsg(
                error.response
                    ? error.response.data?.message || "Registration failed."
                    : "Cannot reach the server. Please try again."
            );
            setMsgType("error");
        } finally {
            setSubmitting(false);
        }
    };

  return (
    <div className="mainBg">
        <div className="flex items-center bg-[#023166] justify-center size-full">
                
            {/* Registration Card */}
            <div className="p-8 mx-2 bg-[#1a73d3] rounded-xl min-w-80 max-w-100
            overflow-y-auto scrollbar-none max-h-full">
                
                {/* Title */}
                <div className="flex items-center gap-2 text-white mb-4 font-medium text-nowrap text-lg">
                    <UserPlus className="size-6"/>
                    Registration Form
                </div>

                {/* Form */}
                <form 
                    className="text-[14.5px] space-y-4"
                    onSubmit={handleSubmit}   
                >
                    <label className="label">
                        First Name
                    </label>
                    <input
                        type="text"
                        required
                        name="fname"
                        value={formData.fname}
                        onChange={handleChange}
                        placeholder="Enter first name"
                        className="inputBox"
                    />

                    <label className="label">
                        Last Name
                    </label>
                    <input
                        type="text"
                        required
                        name="lname"
                        value={formData.lname}
                        onChange={handleChange}
                        placeholder="Enter last name"
                        className="inputBox"
                    />

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
                            className={`my-5 font-medium rounded-md text-center py-1 border
                                ${
                                    msgType === "success"
                                        ? "text-green-700 bg-white/95 border-green-300"
                                        : "text-red-600 bg-white/95 border-red-300"
                                }`}
                        >
                            {msg}
                        </p>
                    )}
                    
                    <div className="flex justify-end w-full">
                        <button 
                            className="button bg-[#ff9c09] shadow-md text-white hover:bg-[#fc9904]/95" 
                            type="submit" 
                            disabled={submitting}
                        >
                            {submitting ? "Registering..." : "Register"}
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
                        Already have an account? <Link to="/login" className="text-white underline">Log in</Link>
                    </p>
                </div>

            </div>

        </div>
    </div>
  );
}

export default Register;