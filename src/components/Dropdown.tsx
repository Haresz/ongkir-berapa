"use client"

import type React from "react"
import { useRef, useState } from "react"
import Input from "./Input"
import useClickOutside from "../lib/helpers/click-outside"

interface DropdownOption {
    value: string
    label: string
}

interface DropdownProps {
    label?: string
    options: DropdownOption[]
    value: string
    onChange: (value: string) => void
    required?: boolean
    withSearch?: boolean
}

const Dropdown: React.FC<DropdownProps> = ({ label, options, value, onChange, required = false, withSearch = false }) => {
    const [isOpen, setIsOpen] = useState(false)
    const [searchTerm, setSearchTerm] = useState("")
    const dropdownRef = useRef<HTMLDivElement | null>(null)

    useClickOutside(dropdownRef, () => setIsOpen(false))

    const handleSelect = (optionValue: string) => {
        onChange(optionValue)
        setIsOpen(false)
        setSearchTerm("")
    }

    const handleSearch = (search: string) => {
        setSearchTerm(search)
    }

    const filteredOptions = options.filter(option =>
        option.label.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <div ref={dropdownRef} className="">
            <div className="flex items-center mb-1">
                <label className="text-sm font-medium text-gray-300">{label}</label>
                {required && <span className="ml-1 text-red-500">*</span>}
            </div>
            <div className="relative">

                <button
                    type="button"
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white text-left focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {options.find((option) => option.value === value)?.label || "Select an option"}
                </button>
                {isOpen && (
                    <ul className=" max-h-[400px] overflow-y-auto absolute z-10 w-full mt-1 bg-gray-700 border border-gray-600 rounded-md shadow-lg">
                        {withSearch && (
                            <li className="  bg-gray-700 px-4 pt-4 pb-1 sticky top-0" >
                                <Input placeholder="Search Your City" value={searchTerm} onChange={(e) => handleSearch(e.target.value)} label={""} />
                            </li>
                        )}

                        {filteredOptions.length > 0 ? (
                            filteredOptions.map((option) => (
                                <li
                                    key={option.value}
                                    className="px-3 py-2 hover:bg-gray-600 cursor-pointer"
                                    onClick={() => handleSelect(option.value)}
                                >
                                    {option.label}
                                </li>
                            ))
                        ) : (
                            <li className="px-3 py-2 text-gray-400">No results found</li>
                        )}
                    </ul>
                )}
            </div>
        </div>
    )
}

export default Dropdown

