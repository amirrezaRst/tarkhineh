const UserInfo = () => {
    return (
        <div className="hidden md:flex items-center lg:justify-start justify-center xl:gap-5 gap-3 pb-3.5 border-b border-b-[#757575]/50">

            {/*//TODO Profile Image */}
            <div className="xl:w-[4.5rem] xl:h-[4.5rem] w-16 h-16 border border-[#CBCBCB]/80 rounded-full">
                <img src="/images/profile-image.png" alt="" className="w-full h-full object-center object-cover" />
            </div>
            <div className="lg:flex hidden flex-col justify-center gap-2">
                <h5 className="xl:text-lg text-[#353535]">
                    کاربر ترخینه
                </h5>
                <p dir="ltr" className="xl:text-super-sm text-sm text-[#717171]">
                    ۰۹۱۴ ۸۶۴ ۳۳۵۰
                </p>
            </div>

        </div>
    );
}

export default UserInfo;