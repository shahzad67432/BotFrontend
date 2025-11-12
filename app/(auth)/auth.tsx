"use client"
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const AuthPage = ( { SignType }: { SignType: string } ) => {

    const [step, setStep] = useState<number>(1);
    const router = useRouter();
    const [email, setEmail] = useState<string>("");

    const handleSignup = async (event: React.FormEvent) => {
        event.preventDefault();
        const response:any = await axios.post('/api/auth/signup', { email, SignType });
        if(response.data.message === "User not found" && SignType === "login"){
            return alert("User not found. Please sign up first.");
        }
        if(response.data.message === "OTP Email sent successfully"){
            setStep(step + 1);
        }
    }

    const handleVerifyOTP = async (event: React.FormEvent) => {
        event.preventDefault();
        const otp = (document.querySelector('input[type="otp"]') as HTMLInputElement).value;
        const response:any = await axios.post('/api/auth/verify-otp', { email, otp, SignType });
        if (response){
            localStorage.setItem('auth_token', response.data.token);
            setStep(step + 1);
        }
    }


    useEffect(() => {
    if (step === 3 && SignType === "login") {
      setStep(1);
      router.push('/');
    }
  }, [step, SignType, router]);


  return (
    <>
        <div>
        <h1>{window.location.pathname == "/signup" ? "Sign Up" : "Login"}</h1>
        {step === 1 && (
            <form>
                <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                <button type="submit" onClick={handleSignup}>Continue</button>
            </form>
        )}
        {step === 2 && (
            <form onSubmit={handleVerifyOTP}>
              <input name="otp" type="otp" placeholder="Enter OTP" required />
              <button type="submit">Verify OTP</button>
            </form>
        )}
        {step === 3 && SignType === "signup" && (
            <>
                <div>
                    <h2>Signup Successful!</h2>
                    <p>You can now access your account.</p>
                </div>
                <button onClick={() => window.location.href = '/'}>Continue</button>
                {setStep(1)}
            </>
        )}
        </div>
    </>
  );
}

export default AuthPage;