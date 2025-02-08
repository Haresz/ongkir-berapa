import type React from "react"

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string
}

const Input: React.FC<InputProps> = ({ label, ...props }) => {
    return (
        <div className="">
            <label className=" inline-block text-sm font-medium text-gray-300 mb-1" htmlFor={props.id}>
                {label}
            </label>
            {props.required && <span className="ml-1 text-red-500">*</span>}
            <input
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                {...props}
            />
        </div>
    )
}

export default Input

