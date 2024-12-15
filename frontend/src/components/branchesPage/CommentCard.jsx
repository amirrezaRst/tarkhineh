import { StarIcon } from "@/assets/Icons";

const CommentCard = ({ fullName, profile }) => {
    return (
        <div
            className="w-[550px] flex-shrink-0 bg-white flex items-center gap-4 border border-[#cbcbcb] rounded-lg p-6"
        >

            {/*// User Info */}
            <div className="flex flex-col items-center justify-center gap-2">
                <div className="w-[5.2rem] h-[5.2rem] border border-[#cbcbcb]/40 rounded-full overflow-hidden">
                    <img src={profile} alt="" className="w-full h-full object-cover" />
                </div>

                <div className="flex flex-col items-center gap-1 text-super-sm text-[#717171]">
                    <p>{fullName}</p>
                    <p>۲۳ اسفند ۱۴۰۱</p>
                </div>
            </div>

            <div className="relative w-full h-full flex-1 flex flex-col justify-center">
                <p className="text-[#353535] text-super-sm text-justify leading-6">
                    از با صفا بودن شعبه اکباتان هر چی بگم کم گفتم. بهترین غذاهای گیاهی عمرمو اینجا خوردم. از مدیریت شعبه اکباتان رستوران‌های ترخینه واقعا تشکر میکنم.
                </p>

                <div className="flex items-center gap-0.5 absolute bottom-0 left-0">
                    <StarIcon className="w-5 h-5" /> <span className="font-medium">۴</span>
                </div>
            </div>

        </div>
    );
}

export default CommentCard;