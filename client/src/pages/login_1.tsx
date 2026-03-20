import type { SubmitHandler } from "react-hook-form";
import {useForm } from "react-hook-form"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { EyeOff , Eye } from "lucide-react"
import { Link } from "react-router-dom";
import loginImg from "../assets/login.jpg";
import { useNavigate } from "react-router-dom";
import axios from "axios";

interface FormInput {
    email : string, 
    password : string
}
interface LoginResponse {
    message :string
}
export function LoginPage() {

const navigate = useNavigate();
const { register , handleSubmit } = useForm<FormInput>();
const handler : SubmitHandler<FormInput> = async(data : any )=>{
try{
const response = await axios.post<LoginResponse>(`${import.meta.env.VITE_BACKEND_URL}/api/users/login` , data , {withCredentials : true});
console.log(data);
alert(response.data.message);
navigate("/");
}catch(err : any){
    alert(err.response.data.message);
}
}

const [showPassword, setShowPassword] = useState(false);
return (
<div className=" relative w-screen h-screen bg-gray-300 flex flex-row justify-center items-center">
<img 
src={loginImg}
alt="login-bg"
className="w-full h-full object-cover"
/>
<div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex flex-col justify-center items-center">
    <div className=" w-100 h-120 flex flex-col backdrop-blur-md justify-center items-center">
        <p className = " text-white text-4xl font-weight-medium mb-4 " style={{fontFamily: 'Lobster'}}>Login</p>
        <form onSubmit = {handleSubmit(handler)}>
        <div className="mb-9 mt-8 flex items-center space-x-4">
            <Label className = " text-white text-lg" style={{fontFamily: 'Lobster'}}>Email</Label>
            <Input className="text-white"placeholder = " Enter Your Email" {... register("email" , {required : true})}/>
        </div>
        <div className="mb-9 flex items-center space-x-4">
            <Label className = " text-white text-lg" style={{fontFamily: 'Lobster'}}>Password</Label>
            <Input className = "text-white"placeholder = " Enter Your Password" type={showPassword ? "text" : "password"}{... register("password" , {required : true})}/>
            <Button className="!bg-white" variant="outline" size="icon"  onClick={() => setShowPassword(!showPassword)}>{showPassword ? <Eye/> : <EyeOff/>}</Button>    
        </div>
        <div className="flex items-center justify-center">
            <Button variant={"outline"} className="w-1/2 !bg-white " type="submit">Login</Button>
        </div>
        <p className="text-white font-weight-medium mt-9">Dont have an account ? <Link to="/register" className="text-blue-400">Register Here</Link></p>
        </form>
    </div>
</div> 
</div>
)
}