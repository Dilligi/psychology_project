import type { AuthOptions,Session,User } from "next-auth";
import Credentials from 'next-auth/providers/credentials'

let userInfo = {
    id: '122',
    role: 'user',
    name: 'John',
    email: 'example@gmail.com',
    password: 'the_best_password_in_the_world',
    age: new Date('23.04.2004'),
    timezone: (new Date()).getTimezoneOffset(),
    problems: ['Боль', 'Печаль', 'Беда']
}

export const authConfig: AuthOptions = {
    providers: [
        Credentials({
            name: "Credentials",
            credentials: {
                email: { label: 'email', type: 'email', required: true },
                password: { label: 'password', type: 'password', required: true }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials.password) return null;

                if (credentials.email === userInfo.email && credentials.password === userInfo.password) {
                    let {password, ...userInfoWithoutPass} = userInfo;
                    return userInfoWithoutPass as User;
                }

                return null;
            }
        }),
    ],
    callbacks: {
        async jwt({token, user}) {
            if (user) {
                token = {...token, ...user}
                console.log('token is', token)
            }
            return token;
        },
        async session({session, token}) {
            if (session?.user) {
                let {iat, exp, jti, ...tokenWithoutCred} = token;
                session.user = {...session.user, ...tokenWithoutCred};
                console.log('session is', session.user)
            }
            return session
        }
    }
}