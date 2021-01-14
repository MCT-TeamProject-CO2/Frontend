export default class Auth {
    constructor(api) {
        this.api = api;
    }

    get base() {
        return this.api.host + '/api/v1/auth';
    }

    /**
     * Makes a login request to "/api/v1/auth/login"
     * @param {string} user Username or email
     * @param {string} password Password
     * @param {boolean} isEmail If the user argument is an email or not
     */
    async login(user, password, isEmail) {
        const body = isEmail ? {
            email: user,
            password
        } : {
            username: user,
            password
        };

        const res = await this.api.post(this.base + '/login', body);
        if (!res.ok) return false;

        const json = await res.json();
        if (json.sessionId) {
            this.api.setSession(json.sessionId);

            return true;
        }
        return false;
    }

    /**
     * Get a session id from a Microsoft OAUTH2 code.
     * @param {string} code 
     */
    async oauth2(code) {
        const res = await this.api.post(
            this.base + '/oauth2',
            { code, uri: location.origin }
        );

        const json = await res.json();
        if (res.ok) {
            this.api.setSession(json.sessionId);

            return [true];
        }
        
        switch (res.status) {
            case 400:
                return [false, "The request body to log you in was malformed."];

            case 404:
                return [false, "Could not find a user matching the Microsoft account you tried to sign-in with, try again and check if you're using the correct account."];
        
            case 406:
                if (json.data.error_codes && json.data.error_codes[0] == 65001)
                    return [false, "The administrator of your account has not enabled sign-in on this application."];

                return [false, "An error occured when communicating with Microsoft's services to sign you in."];
        }
        return [false, "Unknown error occurred, try again later and check if the problem persists."];
    }

    /**
     * Revokes the sessionId server side and clears the sessionStorage locally
     * @param {string} sessionId 
     */
    async revoke(sessionId) {
        const res = await this.api.delete(this.base + '/revoke', { sessionId });

        sessionStorage.clear();

        return res.ok;
    }

    /**
     * Check if a session id is still valid, this should not be relied on.
     */
    async valid() {
        const res = await this.api.get(this.base + '/valid', {}, {
            'Authorization': this.api.getSession(),
        });

        if (!res.ok) return false;

        const json = await res.json();
        return json.valid;
    }
}