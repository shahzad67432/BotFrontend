"use client"
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const loginPage = () => {
    const router = useRouter();
    const handleLogin = async (event: React.FormEvent) => {
        event.preventDefault();
        const form = event.target as HTMLFormElement;
        const email = (document.querySelector('input[type="email"]') as HTMLInputElement).value;
        const response:any = await axios.post('/api/auth/login', { email });
        if (response.data){
            localStorage.setItem('auth_token', response.data.token);
        }
        console.log(response.data);
        router.push('/');
    }

    useEffect(() => {
        const token: any = localStorage.getItem('auth_token');
        if (token && token.expiresIn && token.expiresIn > Date.now()) {
            router.push('/');
        }
    }, [router]);

    return (
        <>
            <h1>Login</h1>
            <form>
                <input type="email" placeholder="Email" />
                <button type="submit" onClick={handleLogin}>Login</button>
            </form>
        </>
    );
}

export default loginPage;