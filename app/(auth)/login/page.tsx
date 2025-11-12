"use client"

import AuthPage from "../auth";

const loginPage = () => {

    return (
        <>
            <AuthPage SignType={"login"} />
            <div>
                <p>Don't have an account? <a href="/signup">Sign up</a></p>
            </div>
        </>
    );
}

export default loginPage;