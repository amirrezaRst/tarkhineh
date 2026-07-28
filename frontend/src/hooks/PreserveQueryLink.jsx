"use client";

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';


const PreserveQueryLink = ({ href, query, children, className, onClick }) => {
    const searchParams = useSearchParams();
    const preserved = Object.fromEntries(searchParams.entries());
    const combinedHref = { pathname: href, query: { ...preserved, ...query } };

    return <Link className={className} href={combinedHref} onClick={onClick}>{children}</Link>;
};

export default PreserveQueryLink;