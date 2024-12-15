import CommentCard from "@/components/branchesPage/CommentCard";

const CommentSection = () => {
    return (
        <section
            className={`container md:py-20 py-12 mt-10 mb-5`}
        >
            <h2 className="md:text-3xl text-2.5xl font-semibold text-center mb-8">نظرات کاربران</h2>

            {/*//! Comments List */}
            <div className="flex gap-8 overflow-x-auto pb-2">

                {
                    [{ fullName: "آرزو محمدعلیزاده", profile: "/images/profile-1.jpg" },
                    { fullName: "سردار وظیفه", profile: "/images/profile-2.jpg" },
                    { fullName: "علی عسگری", profile: "/images/profile-3.jpg" }].map((item, index) =>
                        <CommentCard key={index} {...item} />
                    )
                }

            </div>

        </section>
    );
}

export default CommentSection;