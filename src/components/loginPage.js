import { useGoogleLogin } from '@react-oauth/google';
import Button from 'react-bootstrap/Button';

const LoginPage = ({setUser}) => {

    const responseMessage = (response) => {
        console.log(response);
        setUser(response);
      };
    
    const errorMessage = (error) => {
        console.log(error);
    };

    const login = useGoogleLogin({
        onSuccess: responseMessage,
        onError: errorMessage
    })

    return (
        <div>
            <Button onClick={login}>Inscription avec Google</Button>
        </div>
    );    
}

export default LoginPage;