/* eslint-disable react-hooks/rules-of-hooks */
import { useParams } from 'react-router-dom';

//API POST: create new form
export const createForm = async (data) => {
    const API_URL: string = `http://localhost:8080/form`;

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + JSON.parse(sessionStorage.getItem('token') as string)?.accessToken,
            },
            body: JSON.stringify(data)
        });


        if (!response.ok) {
            throw new Error(`HTTP Error! Status: ${response.status}`);
        }
        return response.json();

        // Xử lý dữ liệu từ máy chủ (nếu cần)
    } catch (error) {
        console.error('Lỗi khi gửi yêu cầu:', error);
    }
};

// API PUT: Update form 
export const updateObjectInDatabase = async (updateData) => {
    try {
        const response = await fetch(`http://localhost:8080/update-form/${useParams()?.formID}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + JSON.parse(sessionStorage.getItem('token') as string)?.accessToken
            },
            body: JSON.stringify(updateData),
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

// API DELETE: delete form by FormId
export const deleteForm = async (objectId) => {
    const API_URL: string = `http://localhost:8080/form`;

    try {
        const response = await fetch(API_URL + `/${objectId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + JSON.parse(sessionStorage.getItem('token') as string)?.accessToken
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP Error! Status: ${response.status}`);
        }

    } catch (error) {
        console.error('Lỗi khi gửi yêu cầu DELETE:', error);
    }
};