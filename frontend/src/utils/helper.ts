interface LoginForm {
    email: string,
    password: string
    setError: React.Dispatch<React.SetStateAction<string | null>>
}

interface SignupForm extends LoginForm {
    confirmPassword: string,
    fullName: string
}

export const validateLogin = ({ email, password, setError }: LoginForm) => {

    if (!email.trim() || !password.trim()) {
        setError('Please fill all fields')
        return false
    } else if (!email.includes('@') || !email.includes('.')) {
        setError('Please enter a valid email')
        return false
    }

    setError(null)
    return true
}

export const validateSignup = ({ fullName, email, password, confirmPassword, setError }: SignupForm) => {

    if (!fullName.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
        setError('Please fill all fields')
        return false
    } else if (!email.includes('@') || !email.includes('.')) {
        setError('Please enter a valid email')
        return false
    } else if (password.length < 6) {
        setError('Password must be at least 6 characters long')
        return false
    } else if (password !== confirmPassword) {
        setError('Passwords do not match')
        return false
    }

    setError(null)
    return true
}

export const addThousandSeparators = (num: number) => {
    if(num === null || isNaN(num)) return '';

    const [integerPart, fractionalPart] = num.toString().split('.');
    const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

    return fractionalPart ? `${formattedInteger}.${fractionalPart}` : formattedInteger;
}