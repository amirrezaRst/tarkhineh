const BranchOpenTag = ({ isOpen }) => {
    if (isOpen === null || isOpen === undefined) return null;
    return isOpen
        ? <span className="inline-flex items-center gap-1.5 text-super-xs font-bold px-2.5 py-1 rounded-full bg-status-delivered-subtle text-status-delivered"><span className="w-1.5 h-1.5 rounded-full bg-current" /> باز است</span>
        : <span className="inline-flex items-center gap-1.5 text-super-xs font-bold px-2.5 py-1 rounded-full bg-status-cancelled-subtle text-status-cancelled"><span className="w-1.5 h-1.5 rounded-full bg-current" /> بسته است</span>;
};

export default BranchOpenTag;
