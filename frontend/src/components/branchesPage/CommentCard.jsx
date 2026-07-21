import { StarIcon } from "@/assets/Icons";

const CommentCard = ({ fullName, profile }) => {
    return (
        <div
            className="lg:w-[550px] md:w-[500px] w-[300px] flex-shrink-0 bg-white flex md:flex-row flex-col md:items-center gap-4 border border-border rounded-lg md:p-6 py-4 px-3"
        >

            {/*// User Info */}
            <div className="flex items-center justify-between gap-4">
                <div className="flex md:flex-col items-center justify-center md:gap-2 gap-3.5">
                    <div className="md:w-[5.2rem] md:h-[5.2rem] w-16 h-16 border border-border/40 rounded-full overflow-hidden">
                        <img src={profile} alt="" className="w-full h-full object-cover" />
                    </div>

                    <div className="flex flex-col md:items-center items-start gap-1 md:text-super-sm text-super-xs text-muted-fg">
                        <p>{fullName}</p>
                        <p className="md:text-super-sm text-xs">۲۳ اسفند ۱۴۰۱</p>
                    </div>
                </div>
                <div className="md:hidden flex items-center gap-0.5">
                    <StarIcon className="w-5 h-5" /> <span className="font-medium">۴</span>
                </div>
            </div>

            <div className="relative w-full h-full flex-1 flex flex-col justify-center">
                <p className="text-foreground md:text-super-sm text-super-xs text-justify md:leading-6">
                    از با صفا بودن شعبه اکباتان هر چی بگم کم گفتم. بهترین غذاهای گیاهی عمرمو اینجا خوردم. از مدیریت شعبه اکباتان رستوران‌های ترخینه واقعا تشکر میکنم.
                </p>

                <div className="md:flex hidden items-center gap-0.5 absolute bottom-0 left-0">
                    <StarIcon className="w-5 h-5" /> <span className="font-medium">۴</span>
                </div>
            </div>

        </div>
    );
}

export default CommentCard;