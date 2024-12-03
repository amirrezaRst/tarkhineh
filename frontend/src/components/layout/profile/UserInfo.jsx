const UserInfo = () => {
    return (
        <div className="flex items-center gap-5 pb-3.5 border-b border-[#757575]">

            {/*//TODO Profile Image */}
            <div className="w-[4.5rem] h-[4.5rem] border border-[#CBCBCB]/80 rounded-full">
                <img src="/images/profile-image.png" alt="" className="w-full h-full object-center object-cover" />
            </div>
            <div className="flex flex-col justify-center gap-2">
                <h5 className="text-lg text-[#353535]">
                    کاربر ترخینه
                </h5>
                <p dir="ltr" className="text-super-sm text-[#717171]">
                    ۰۹۱۴ ۸۶۴ ۳۳۵۰
                </p>
            </div>

        </div>
    );
}

export default UserInfo;