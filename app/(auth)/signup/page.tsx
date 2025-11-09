
const signup_page = () => {

    var step: number = 1;

    const handleSignup = async (event: React.FormEvent) => {
        event.preventDefault();
        const form = event.target as HTMLFormElement;
        const email = (document.querySelector('input[type="email"]') as HTMLInputElement).value;
        const response:any = await axios.post('/api/auth/signup', { email });
        if (response.data){
            step++;
        }
        console.log(response.data);
    }

    const handleVerifyOTP = async (event: React.FormEvent) => {
        event.preventDefault();
        const form = event.target as HTMLFormElement;
        const otpInput = form.elements.namedItem("otp") as HTMLInputElement;
        const otp = otpInput.value;
        const email = (document.querySelector('input[type="email"]') as HTMLInputElement).value;
        const response:any = await axios.post('/api/auth/verify-otp', { email, otp });
        if (response.data){
            localStorage.setItem('auth_token', response.data.token);
            step++;
        }
        console.log(response.data);
    }

  return (
    <>
        <div>
        <h1>Sign Up</h1>
        {step === 1 && (
            <form>
                <input type="email" placeholder="Email" />
                <button type="submit" onClick={handleSignup}>Continue</button>
            </form>
        )}
        {step === 2 && (
            <form>
                <input name="otp" type="text" placeholder="Enter OTP" />
                <button type="submit" onClick={handleVerifyOTP}>Verify OTP</button>
            </form>
        )}
        {step === 3 && (
            <>
                <div>
                    <h2>Signup Successful!</h2>
                    <p>You can now access your account.</p>
                </div>
                <button onClick={() => window.location.href = '/'}>Continue</button>
            </>
        )}
        </div>
    </>
  );
}

export default signup_page;