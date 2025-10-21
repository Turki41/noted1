import { useState } from "react";
import { LuChevronDown, LuChevronUp } from "react-icons/lu";


interface SelectDropdownProps {
    options: { label: string; value: string }[];
    value: string;
    onChange: (value: any) => void;
    placeholder?: string;
}

const SelectDropdown = ({ options, value, onChange, placeholder }: SelectDropdownProps) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleSelect = (option: string) => {
        onChange(option);
        setIsOpen(false);
    }
    return (
        <div className="relative w-full">
            <button onClick={() => setIsOpen(!isOpen)} className="w-full text-sm text-black bg-white border border-slate-100 outline-none px-2.5 py-3 rounded-md mt-2 flex justify-between items-center">
                {value ? options.find((opt) => opt.value === value)?.label : placeholder}
                <span className="ml-2">{isOpen ? <LuChevronUp /> : <LuChevronDown />}</span>
            </button>

            {isOpen && (
                <div className="absolute w-full flex flex-col bg-white border border-slate-100 rounded-md mt-1 shadow-md z-10">
                    {options.map((option) => (
                        <button key={option.value} onClick={() => handleSelect(option.value)} className="px-3 w-full py-2 text-sm text-start hover:bg-gray-100">
                            {option.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    )
}

export default SelectDropdown