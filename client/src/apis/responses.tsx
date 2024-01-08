/* eslint-disable react-hooks/rules-of-hooks */
import { useParams } from 'react-router-dom';

//API POST: create a new response
export const addResponsetoDatabase = async (data) => {
    try {
        const response = await fetch(`http://localhost:8080/form-response/${useParams()?.formID}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + JSON.parse(sessionStorage.getItem('token') as string)?.accessToken
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error(`HTTP Error! Status: ${response.status}`);
        }

        const dataFromServer = await response.json();
        // Xử lý dữ liệu từ máy chủ (nếu cần)
    } catch (error) {
        console.error('Lỗi khi gửi yêu cầu:', error);
    }
};