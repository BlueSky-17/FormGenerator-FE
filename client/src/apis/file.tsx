// API DELETE: delete file by fileName
export const uploadFileToS3 = async (files: File) => {
    const formData = new FormData();

    // files.map((file) => (formData.append('files', file)
    // ))
    formData.append('files', files)

    const apiUrl = process.env.REACT_APP_ROOT_URL + 'upload-to-s3';

    // console.log(file);
    console.log(formData)

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

export const deleteFile = async (fileName) => {
    try {
        const response = await fetch(process.env.REACT_APP_ROOT_URL + 'delete-from-s3' + `/${fileName}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem('token') as string)?.accessToken
            }
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
    } catch (error) {
        console.error('Lỗi khi gửi yêu cầu DELETE:', error);
    }
};

