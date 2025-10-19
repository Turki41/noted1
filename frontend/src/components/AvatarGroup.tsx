import { LuUser } from "react-icons/lu";

interface AvatarGroupProps {
    avatars: any;
    maxVisible: number;
}
const AvatarGroup = ({ avatars, maxVisible }: AvatarGroupProps) => {
    return (
        <div className="flex items-center">
            {avatars.slice(0, maxVisible).map((avatar: string, index: number) => (
                <div key={index}>
                    {avatar ? <img src={avatar} alt="avatar" className='w-9 h-9 rounded-full object-cover' /> : <LuUser size={34} />}
                </div>
            ))}

            {avatars.length > maxVisible && (
                <div className="w-9 h-9 flex items-center justify-center bg-blue-50 text-sm font-medium rounded-full border-2 border-white -ml-3">
                    +{avatars.length - maxVisible}
                </div>
            )}
        </div>
    )
}

export default AvatarGroup