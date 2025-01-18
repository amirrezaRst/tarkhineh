"use client";

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';


const PreserveQueryLink = ({ href, query, children, className }) => {
    const branch = useSearchParams().get("branch");
    const combinedHref = { pathname: href, query: branch ? { branch, ...query } : { ...query } };

    return <Link className={className} href={combinedHref}>{children}</Link>;
};

export default PreserveQueryLink;