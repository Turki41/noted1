import { useRef, useState } from "react"
import { LuUser, LuUpload, LuTrash } from "react-icons/lu"

interface ProfilePhotoSelectorProps {
    image: File | null,
    setImage: React.Dispatch<React.SetStateAction<File | null>>
}

const ProfilePhotoSelector = ({ image, setImage }: ProfilePhotoSelectorProps) => {
    const inputRef = useRef<HTMLInputElement | null>(null)
    const [previewUrl, setPreviewUrl] = useState<null | string>(null)

    const handleImageChange = (event: any) => {
        const file = event.target.files[0]
        if(file) {
            //Update the image
            setImage(file)

            //Generate preview URL from the title
            const preview = URL.createObjectURL(file)
            setPreviewUrl(preview)
        }
    }

    const handleRemoveImage = () => {
        setImage(null)
        setPreviewUrl(null)
    }

    const onChooseFile = () => {
        inputRef.current?.click()
    }

    return (
        <div className="flex justify-center mb-3">
            <input type="file" accept="image/*" ref={inputRef} onChange={handleImageChange} className="hidden"/>

            {!image?  (
                <div className="w-20 h-20 flex items-center justify-center bg-blue-100/50 rounded-full relative cursor-pointer">
                    <LuUser className="text-4xl text-blue-500"/>
                    <button className="w-8 h-8 flex items-center bg-blue-500 text-white rounded-full justify-center absolute -bottom-1 -right-1 " type="button" onClick={onChooseFile}>
                        <LuUpload/>
                    </button>

                </div>
            ) : (
                <div className="relative">
                    <img src={previewUrl!} alt="previewImage" className="w-20 h-20 rounded-full object-cover"/>
                    <button type="button" onClick={handleRemoveImage} className="w-8 h-8 items-center flex justify-center bg-red-500 text-white rounded-full absolute -bottom-1 -right-1">
                        <LuTrash/>
                    </button>
                </div>
            )}
        </div>
    )
}

export default ProfilePhotoSelector