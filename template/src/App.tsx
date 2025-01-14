import { useEffect } from "react";
import Page from "./app/dashboard/page";

export default function App() {
    useEffect(() => {
        const handleBeforeUnload = () => {
            fetch('http://127.0.0.1:8001/remove-logs/', { 
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            }).catch(error => {
                console.error("Failed to send request to remove logs:", error);
            });
        };

        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, []);

    return (
        <>
            <Page />
        </>
    );
}
