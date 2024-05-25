/* eslint-disable react-hooks/rules-of-hooks */
import { useParams } from 'react-router-dom';

//API POST: create new form
export const createForm = async (data) => {
    const API_URL: string = process.env.REACT_APP_ROOT_URL + `form`;

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem('token') as string)?.accessToken,
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
        const response = await fetch(process.env.REACT_APP_ROOT_URL + `update-form/${useParams()?.formID}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem('token') as string)?.accessToken
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
    const API_URL: string = process.env.REACT_APP_ROOT_URL + `form`;

    try {
        const response = await fetch(API_URL + `/${objectId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem('token') as string)?.accessToken
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP Error! Status: ${response.status}`);
        }

    } catch (error) {
        console.error('Lỗi khi gửi yêu cầu DELETE:', error);
    }
};

export const generateFormByDataSheet = async (file: File) => {
    const formData = new FormData();

    // files.map((file) => (formData.append('files', file)
    // ))
    formData.append('file', file)

    const apiUrl = process.env.REACT_APP_ROOT_URL + 'generator/sheet';

    // Gửi yêu cầu POST sử dụng fetch
    const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem('token') as string)?.accessToken
        },
        body: formData,
    });

    // Kiểm tra nếu yêu cầu thành công (status code 2xx)
    if (response.ok) {
        const responseData = await response.json();
        console.log('Server Response:', responseData);
        return responseData;
    } else {
        // Xử lý lỗi nếu có
        const errorData = await response.json();
        console.error('Server Error:', errorData);
    }
};

export const generateFormByDescription = async (des: string) => {
    const apiUrl = process.env.REACT_APP_ROOT_URL + 'generator/description';

    // Gửi yêu cầu POST sử dụng fetch
    const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem('token') as string)?.accessToken
        },
        body: JSON.stringify({
            description: des 
        })
    });

    // Kiểm tra nếu yêu cầu thành công (status code 2xx)
    if (response.ok) {
        const responseData = await response.json();
        console.log('Server Response:', responseData);
        return responseData;
    } else {
        // Xử lý lỗi nếu có
        const errorData = await response.json();
        console.error('Server Error:', errorData);
    }
};


export const generateFormByImage = async (file: File) => {
    const formData = new FormData();

    // files.map((file) => (formData.append('files', file)
    // ))
    formData.append('file', file)

    const apiUrl = process.env.REACT_APP_ROOT_URL + 'generator/image';

    // Gửi yêu cầu POST sử dụng fetch
    const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem('token') as string)?.accessToken
        },
        body: formData,
    });

    // Kiểm tra nếu yêu cầu thành công (status code 2xx)
    if (response.ok) {
        const responseData = await response.json();
        console.log('Server Response:', responseData);
        return responseData;
    } else {
        // Xử lý lỗi nếu có
        const errorData = await response.json();
        console.error('Server Error:', errorData);
    }
};