export const typeOfFile = ['Tài liệu', 'Bảng tính', 'PDF', 'Hình ảnh', 'Video'];

export const myRecordType: Record<string, string> = {
    //Đuôi docx
    "Tài liệu": 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    //Đuôi .xlsx
    "Bảng tính": 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    //Đuôi .pdf
    "PDF": 'application/pdf',
    //Đuối .png và .jpg
    "Hình ảnh": 'image/png',
    //Đuôi .mp4
    "Video": 'video/mp4',
};