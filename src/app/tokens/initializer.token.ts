import { User, getAuth } from "firebase/auth";
import { AuthService } from "services/auth.service";

export function initializer(authService: AuthService) {
    return async () => {
        const auth = getAuth();
        const user = await new Promise<User | null>((resolve) => {
            const unsubscribe = auth.onAuthStateChanged((user) => {
                unsubscribe();
                resolve(user);
            });
        });
        if (user) {
            authService.authUser.set(user);
        } else {
            authService.authUser.set(null);
        }
        return Promise.resolve();
    };
}