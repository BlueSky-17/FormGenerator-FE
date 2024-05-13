export const updateUser = async (updateUser, useId) => {
    try {
        const response = await fetch(process.env.REACT_APP_ROOT_URL + `update-user/${useId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem('token') as string)?.accessToken,
                'Role': 'admin'
            },
            body: JSON.stringify(updateUser),
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