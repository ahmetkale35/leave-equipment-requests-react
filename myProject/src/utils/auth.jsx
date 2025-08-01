// utils/auth.js
export function isTokenValid() {
    const token = localStorage.getItem('token');
    if (!token) return false;
    
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const currentTime = Date.now() / 1000;
        
        // Token'ın süresi dolmuş mu kontrol et (60 dakika = 3600 saniye)
        if (payload.exp && payload.exp < currentTime) {
            console.log('Token süresi dolmuş, temizleniyor...');
            localStorage.removeItem('token');
            return false;
        }
        
        return true;
    } catch (error) {
        console.error("Token validation error:", error);
        localStorage.removeItem('token');
        return false;
    }
}

export function getUserRoleFromToken() {
    if (!isTokenValid()) return null;
    
    const token = localStorage.getItem('token');
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
    } catch (error) {
        console.error("Token decode hatası:", error);
        localStorage.removeItem('token');
        return null;
    }
}

// Token'ın ne kadar süre kaldığını hesapla
export function getTokenTimeRemaining() {
    const token = localStorage.getItem('token');
    if (!token) return 0;
    
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const currentTime = Date.now() / 1000;
        const timeRemaining = payload.exp - currentTime;
        return Math.max(0, timeRemaining);
    } catch (error) {
        return 0;
    }
}
