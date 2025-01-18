export const fetchMenuPageItems = async (branchId, category, foodType, isPersian, setItems) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/branch/get-branch-items/${branchId}?sortBy=asc&category=${category}&foodType=${foodType || ""}&isPersian=${isPersian || ""}`);
    const data = await res.json();

    setItems(data?.branch?.menus);
}

export const fetchBranchPageItems = async (branchId, category, ratingSort, setItems) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/branch/get-branch-items/${branchId}?limit=10&category=${category}&sortBy=${ratingSort && 'rating'}`);
    const data = await res.json();

    setItems(data?.branch?.menus);
}


