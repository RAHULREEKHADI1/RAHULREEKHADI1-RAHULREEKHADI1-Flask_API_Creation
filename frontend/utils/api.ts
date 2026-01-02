export const authorizedFetch = async (url: string, options: any = {}) => {
    let token = localStorage.getItem('access_token');
    
    const headers = {
        ...options.headers,
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
    };

    let response = await fetch(url, { ...options, headers });

    if (response.status === 401) {
        const refreshToken = localStorage.getItem('refresh_token');

        if (refreshToken) {
            const refreshRes = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/refresh`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${refreshToken}` }
            });

            if (refreshRes.ok) {
                const data = await refreshRes.json();
                localStorage.setItem('access_token', data.access_token);
                
                headers['Authorization'] = `Bearer ${data.access_token}`;
                response = await fetch(url, { ...options, headers });
            } else {
                localStorage.clear();
                window.location.href = '/';
            }
        }
    }

    return response;
};