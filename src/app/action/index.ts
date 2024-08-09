import { signIn, signOut } from "next-auth/react";

export async function doSocialLogin(formData: FormData) {
    const action = formData.get('action') as string;
    console.log(2)
    if (action) {
        await signIn(action, { callbackUrl: "/" });
        
    } else {
        throw new Error("No action specified for social login");
    }
}

export async function doLogout(formData: FormData) {
    await signOut({ callbackUrl: "/login" });
}


