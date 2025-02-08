import type React from "react"

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode
    isLoading?: boolean
}

const Button: React.FC<ButtonProps> = ({ children, isLoading, ...props }) => {
    return (
        <button
            className={`w-full cursor-pointer px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 ${isLoading ? "opacity-60" : ""}`}
            {...props}
        >
            {isLoading ? <p className="italic">Tunggu bentar...</p> : children}
            {/* {children} */}
        </button>
    )
}

export default Button

