
interface InfoCardProps {
    label: string;
    value: string | number;
    color: string;
}

const InfoCard = ({ label, value, color }: InfoCardProps) => {
    return (
        <div className="flex items-center gap-1">
            <div className={`w-5 h-5 flex items-center justify-center  ${color} rounded-full`}>
                <p className="text-xs md:text-[14px] text-gray-500 items-center">
                    <span className="text-sm md:text-[15px] text-black font-semibold">{value}</span>
                </p>
            </div>
            <span className="text-wrap text-center">{label}</span>
        </div>
    )
}

export default InfoCard