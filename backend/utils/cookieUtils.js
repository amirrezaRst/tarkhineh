const setCookie = (res, name, value, options) => {
    res.cookie(name, value, options);
};

const createCommonCookieOptions = (maxAge, path = '/') => ({
    httpOnly: true,
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
    maxAge: maxAge,
    path: path
});

const setRefreshTokenCookie = (res, refreshToken) => {
    setCookie(res, 'refreshToken', refreshToken, createCommonCookieOptions(86400000 * 30)); // 30 days
};

const setTokenCookie = (res, token) => {
    setCookie(res, 'token', token, createCommonCookieOptions(86400000));
};

// Must use the same path/sameSite/secure as when the cookies were set,
// otherwise the browser treats it as a different cookie and won't clear it.
const clearAuthCookies = (res) => {
    const options = { ...createCommonCookieOptions(0), expires: new Date(0) };
    res.cookie('token', '', options);
    res.cookie('refreshToken', '', options);
};

module.exports = {
    setRefreshTokenCookie,
    setTokenCookie,
    clearAuthCookies
};
