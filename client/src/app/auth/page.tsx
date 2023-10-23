import { Button } from "@mui/material";
import Link from "next/link";
import styles from './login.module.css'


export default function Login() {
    return (
        <div className={styles.container}>
            <div>
                <Link href='/api/auth/signin'>
                <Button variant="contained" fullWidth className={styles.btn}>
                    Вход
                </Button>
                </Link>
                <Link href='/reg'>
                <Button variant="contained" fullWidth className={styles.btn}>
                    Регистрация
                </Button>
                </Link>
            </div>
        </div>
    )
}