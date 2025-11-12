import AuthPage from "../auth";

const signup_page = () => {
    return (
        <>
            <AuthPage SignType={"signup"} />
            <div>
                <p>Already have an account? <a href="/login">Login</a></p>
            </div>
        </>
  );
}

export default signup_page;