// Cache key builders, shared between the routes that read (via cacheMiddleware)
// and the controllers that write (so invalidation always targets the exact key
// a read would have used).

exports.branchesAllKey = () => 'cache:branches:all';

exports.branchByIdKey = (id) => `cache:branch:${id}`;

// Filter/sort query variants each get their own key; free-text search is
// excluded (see branchRoutes) since it has too much cardinality to be worth
// caching and would just take up space with near-zero hit rate.
exports.branchItemsKey = (id, query = {}) => {
    const { category = '', foodType = '', isPersian = '', sortBy = '', limit = '' } = query;
    return `cache:branch-items:${id}:${category}:${foodType}:${isPersian}:${sortBy}:${limit}`;
};

exports.branchStatsKey = (branchId, period) => `cache:branch-stats:${branchId}:${period}`;

// Admin dashboard endpoints. Each aggregates across the whole Order/User/
// Review collection with no single write path that would be practical to
// invalidate on (any order status change, any new review, anywhere, could
// affect these) — so these rely on TTL alone rather than invalidation, same
// tradeoff as branchItemsKey above.
exports.adminOverviewKey = () => 'cache:admin:overview';
exports.adminReportsKey = (period) => `cache:admin:reports:${period}`;
exports.adminFinanceKey = (period) => `cache:admin:finance:${period}`;
exports.adminActivityKey = () => 'cache:admin:activity';
