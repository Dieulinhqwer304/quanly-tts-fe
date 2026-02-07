# 📋 HƯỚNG DẪN LUỒNG TUYỂN DỤNG THỰC TẬP SINH

## 🎯 Tổng quan luồng

Hệ thống quản lý tuyển dụng thực tập sinh bao gồm 10 bước chính, từ đề xuất nhu cầu đến onboarding thực tập sinh mới.

---

## 📍 BƯỚC 1: Mentor/Trưởng nhóm đề xuất nhu cầu tuyển dụng

### Màn hình: **Mentor Request List**
**Đường dẫn:** `/recruitment/mentor-requests`

### Chức năng:
- Mentor/Trưởng nhóm tạo đề xuất tuyển dụng
- Điền thông tin: vị trí, số lượng, yêu cầu kỹ năng, thời gian dự kiến

### Cách sử dụng:
1. Truy cập menu: **Quản lý Tuyển dụng (HR)** → **Đề xuất tuyển dụng**
2. Click nút **"+ Tạo đề xuất mới"**
3. Điền form:
   - Loại: Recruitment
   - Tên kế hoạch
   - Tiêu đề đề xuất
   - Phòng ban
   - Độ ưu tiên (High/Medium/Low)
4. Click **"Gửi đề xuất"**
5. Trạng thái mặc định: **Pending** (Chờ HR xử lý)

---

## 📍 BƯỚC 2: HR tạo kế hoạch tuyển dụng

### Màn hình: **Recruitment Plan List**
**Đường dẫn:** `/recruitment/plans`

### Chức năng:
- HR xem tất cả đề xuất từ các phòng ban
- Tổng hợp và tạo kế hoạch tuyển dụng chính thức
- Xác định timeline, kênh đăng tuyển, lịch phỏng vấn

### Cách sử dụng:
1. Truy cập menu: **Quản lý Tuyển dụng (HR)** → **Kế hoạch tuyển dụng**
2. Click **"+ Tạo kế hoạch mới"**
3. Điền thông tin:
   - **Tab "Thông tin chung":**
     - Tên chiến dịch (VD: "Tuyển dụng Hè 2025")
     - Tên đợt/khóa (VD: "Đợt 1 - Summer Internship")
     - Mô tả chiến dịch
   - **Tab "Vị trí & Yêu cầu":**
     - Thêm các vị trí cần tuyển
     - Số lượng cho mỗi vị trí
     - Yêu cầu chính
   - **Tab "Lịch trình & Trạng thái":**
     - Thời gian bắt đầu - kết thúc
     - Trạng thái: **Pending Approval** (Chờ duyệt)
   - **Tab "Quy trình phê duyệt":**
     - Chọn người duyệt (Giám đốc)
4. Click **"Lưu kế hoạch"**

### Trạng thái:
- **Pending Approval**: Chờ Giám đốc phê duyệt
- **Active (Hiring)**: Đang tuyển dụng
- **On Hold**: Tạm dừng
- **Closed**: Đã đóng

---

## 📍 BƯỚC 3-4: Giám đốc phê duyệt kế hoạch

### Màn hình: **Director Approvals**
**Đường dẫn:** `/director/approvals`

### Chức năng:
- Giám đốc xem danh sách kế hoạch chờ duyệt
- Phê duyệt hoặc yêu cầu điều chỉnh

### Cách sử dụng:
1. Truy cập menu: **Cổng thông tin Giám đốc** → **Phê duyệt kế hoạch**
2. Xem danh sách kế hoạch có trạng thái **Pending**
3. Click **"Xem chi tiết"** để xem đầy đủ thông tin
4. Thực hiện hành động:
   - **Phê duyệt**: Click nút **"Approve"** → Kế hoạch chuyển sang **Active**
   - **Yêu cầu điều chỉnh**: Click **"Request Changes"** → Nhập lý do → Gửi lại HR
   - **Từ chối**: Click **"Reject"** → Nhập lý do

### Kết quả:
- Nếu **Approved**: Kế hoạch chuyển sang trạng thái **Active** → HR có thể đăng tin tuyển dụng
- Nếu **Rejected/Changes**: HR nhận thông báo và cập nhật lại

---

## 📍 BƯỚC 5: HR đăng tin tuyển dụng

### Màn hình: **Recruitment Job List**
**Đường dẫn:** `/recruitment/jobs`

### Chức năng:
- Tạo tin tuyển dụng chi tiết cho từng vị trí
- Đăng lên website công khai

### Cách sử dụng:
1. Truy cập menu: **Quản lý Tuyển dụng (HR)** → **Tin tuyển dụng**
2. Click **"+ Tạo tin tuyển dụng"**
3. Điền form:
   - Chọn chiến dịch (từ kế hoạch đã được duyệt)
   - Tên công việc (VD: "Frontend Developer Intern")
   - Phòng ban
   - Số lượng cần tuyển
   - Cấp bậc (Intern/Junior/Mid/Senior)
   - Mức lương/hỗ trợ
   - Hạn nộp hồ sơ
   - **Mô tả công việc** (sử dụng TinyMCE editor)
   - **Yêu cầu ứng viên**
   - **Quyền lợi**
   - Hình thức làm việc (Remote/Onsite/Hybrid)
4. Chọn trạng thái:
   - **Đang mở**: Hiển thị trên website công khai
   - **Đã đóng**: Không nhận hồ sơ mới
   - **Ẩn**: Tạm ẩn khỏi website
5. Click **"Đăng tin"**

### Kết quả:
- Tin tuyển dụng xuất hiện trên trang **Job Board** (`/jobs`)
- Ứng viên có thể xem và nộp hồ sơ

---

## 📍 BƯỚC 6: Ứng viên nộp đơn ứng tuyển

### Màn hình: **Job Board (Public)**
**Đường dẫn:** `/jobs` (Trang công khai)

### Chức năng:
- Ứng viên xem danh sách tin tuyển dụng
- Nộp hồ sơ trực tuyến

### Cách sử dụng (Phía ứng viên):
1. Truy cập website: `http://localhost:5173/jobs`
2. Duyệt danh sách tin tuyển dụng
3. Click vào tin quan tâm → Xem chi tiết
4. Click **"Ứng tuyển ngay"**
5. Điền form:
   - Họ và tên
   - Email
   - Số điện thoại
   - Năm sinh
   - Upload CV (PDF/DOC)
   - Thư giới thiệu (optional)
6. Click **"Nộp hồ sơ"**

### Kết quả:
- Hệ thống tạo **Đơn ứng tuyển** (Candidate)
- Trạng thái mặc định: **Pending Review** (Chờ HR duyệt)
- Ứng viên nhận email xác nhận đã nộp hồ sơ

---

## 📍 BƯỚC 7: HR sàng lọc hồ sơ (CV Screening)

### Màn hình: **CV Screening**
**Đường dẫn:** `/candidate/cv-list`

### Chức năng:
- Xem danh sách tất cả hồ sơ ứng tuyển
- Sàng lọc và phân loại ứng viên

### Cách sử dụng:
1. Truy cập menu: **Quản lý hồ sơ (CV)** → **CV Screening**
2. Sử dụng bộ lọc:
   - Tìm kiếm theo tên
   - Lọc theo vị trí ứng tuyển
   - Lọc theo trạng thái:
     - **Pending Review**: Chờ xem xét
     - **Shortlisted**: Đạt vòng CV
     - **Rejected**: Từ chối
3. Click vào từng ứng viên để xem chi tiết:
   - Thông tin cá nhân
   - Email, số điện thoại
   - Vị trí ứng tuyển
   - Ngày ứng tuyển
   - Trạng thái hiện tại
   - **Xem CV** (Download hoặc Preview)
4. Thực hiện hành động:
   - **Shortlist**: Click nút **"Chọn lọc ứng viên"** → Chuyển sang **Shortlisted**
   - **Reject**: Click nút **"Loại ứng viên"** → Nhập lý do → Chuyển sang **Rejected**

### Thống kê hiển thị:
- Tổng số hồ sơ
- Số hồ sơ chờ xem xét
- Số hồ sơ đã chọn lọc
- Số hồ sơ đã loại

---

## 📍 BƯỚC 8: Gửi email kết quả vòng CV + lịch phỏng vấn

### Màn hình: **Interview Schedule**
**Đường dẫn:** `/candidate/interviews`

### Chức năng:
- Lên lịch phỏng vấn cho ứng viên đạt vòng CV
- Gửi email mời phỏng vấn hàng loạt
- Gửi email từ chối cho ứng viên không đạt

### Cách sử dụng:

#### **A. Mời phỏng vấn (Shortlisted candidates)**
1. Truy cập menu: **Quản lý hồ sơ (CV)** → **Lịch phỏng vấn**
2. Tab **"Hàng đợi ứng viên"**:
   - Xem danh sách ứng viên có trạng thái **Shortlisted**
   - Chọn các ứng viên cần mời phỏng vấn (checkbox)
3. Click **"Tiếp tục"** → Chuyển sang tab **"Cấu hình & Gửi"**
4. Thiết lập chi tiết phỏng vấn:
   - **Ngày phỏng vấn**: Chọn ngày
   - **Khung giờ**: VD: "9:00 AM - 10:00 AM"
   - **Hình thức**:
     - Trực tuyến (Online): Nhập link Google Meet/Zoom
     - Trực tiếp (In-person): Nhập địa chỉ
5. Cấu hình email:
   - Chọn **Template**: "Interview Invitation"
   - Tiêu đề email: "Thư mời phỏng vấn - [Vị trí]"
   - Xem trước nội dung email
6. Click **"Lên lịch & Gửi"**

#### **B. Gửi email từ chối**
1. Ở tab **"Hàng đợi ứng viên"**, chọn ứng viên có trạng thái **Rejected**
2. Click **"Gửi email từ chối"**
3. Chọn template: "Rejection Email"
4. Xem trước và gửi

### Kết quả:
- Ứng viên nhận email mời phỏng vấn với đầy đủ thông tin
- Lịch phỏng vấn được lưu trong hệ thống
- Trạng thái ứng viên: **Shortlisted** → **Interview Scheduled**

---

## 📍 BƯỚC 9: HR cập nhật kết quả phỏng vấn

### Màn hình: **CV Detail**
**Đường dẫn:** `/candidate/cv-detail/:id`

### Chức năng:
- Cập nhật kết quả sau buổi phỏng vấn
- Gửi email thông báo kết quả

### Cách sử dụng:
1. Từ màn hình **CV Screening**, click vào ứng viên đã phỏng vấn
2. Hoặc truy cập trực tiếp: `/candidate/cv-detail/[ID]`
3. Cập nhật trạng thái:
   - **Đạt phỏng vấn**: 
     - Click **"Approve"** hoặc **"Pass Interview"**
     - Trạng thái → **Passed Interview**
     - Gửi email thông báo trúng tuyển (bao gồm lịch onboard, danh sách giấy tờ cần chuẩn bị)
   - **Không đạt**:
     - Click **"Reject"**
     - Nhập lý do
     - Gửi email cảm ơn

### Email tự động:
- **Đạt**: "Chúc mừng! Bạn đã trúng tuyển..."
- **Không đạt**: "Cảm ơn bạn đã tham gia phỏng vấn..."

---

## 📍 BƯỚC 10: Chuyển ứng viên → Thực tập sinh + Onboarding

### Màn hình: **Onboarding List**
**Đường dẫn:** `/recruitment/onboarding`

### Chức năng:
- Chuyển đổi ứng viên đạt phỏng vấn thành thực tập sinh
- Theo dõi tiến độ onboarding (4 bước)
- Cấp tài khoản và phân công mentor

### Cách sử dụng:

#### **A. Chuyển đổi ứng viên → Thực tập sinh**
1. Từ **CV Detail** của ứng viên đã **Passed Interview**
2. Click **"Chuyển thành thực tập sinh"** (Convert to Intern)
3. Điền thông tin bổ sung:
   - Chọn **Mentor** phụ trách
   - Chọn **Chuyên ngành thực tập** (Track)
   - Phòng ban
   - Thời gian thực tập (Bắt đầu - Kết thúc)
4. Click **"Tạo hồ sơ thực tập sinh"**

#### **B. Theo dõi tiến độ Onboarding**
1. Truy cập: `/recruitment/onboarding`
2. Xem danh sách thực tập sinh mới với 4 bước:
   - **Bước 1**: Bổ sung hồ sơ (Documents)
   - **Bước 2**: Cấp tài khoản & Email (Account Setup)
   - **Bước 3**: Đào tạo nhập môn (Orientation)
   - **Bước 4**: Giao Task đầu tiên (First Assignment)

3. Thực hiện từng bước:
   - Click **"Tiến cấp"** (Advance) để chuyển sang bước tiếp theo
   - Hoặc click **"Thêm"** (More) → Chọn:
     - **Gửi nhắc nhở**: Nhắc TTS hoàn thành bước hiện tại
     - **Duyệt bước tiếp theo**: Chuyển nhanh
     - **Hủy Onboarding**: Hủy quy trình

4. Trạng thái:
   - **In Progress**: Đang thực hiện
   - **Delayed**: Bị chậm tiến độ
   - **Completed**: Hoàn thành onboarding

#### **C. Cấp tài khoản hệ thống**
Khi đến **Bước 2** (Cấp tài khoản):
1. Tạo tài khoản đăng nhập cho TTS
2. (Tùy chọn) Tạo email doanh nghiệp
3. Gửi thông tin đăng nhập qua email

---

## 📍 SAU BƯỚC 10: Quản lý Thực tập sinh

### Màn hình: **Intern List**
**Đường dẫn:** `/internship/interns`

### Chức năng:
- Xem danh sách tất cả thực tập sinh
- Quản lý hồ sơ, tiến độ, đánh giá

### Các màn hình liên quan:
- **Mentor Task Management** (`/mentor/tasks`): Giao việc cho TTS
- **Mentor Learning Path** (`/mentor/learning-path`): Quản lý lộ trình học tập
- **Mentor Evaluation** (`/mentor/eval-phase1`, `/mentor/eval-phase2`, `/mentor/eval-final`): Đánh giá TTS

---

## 🎨 THỐNG KÊ & BÁO CÁO

### Dashboard
**Đường dẫn:** `/`

Hiển thị tổng quan:
- Số vị trí đang mở
- Số hồ sơ chờ duyệt
- Số buổi phỏng vấn sắp tới
- Tỷ lệ chuyển đổi (Conversion Rate)
- Số thực tập sinh đang hoạt động

---

## 🔐 PHÂN QUYỀN

| Vai trò | Quyền truy cập |
|---------|----------------|
| **Mentor/Trưởng nhóm** | Tạo đề xuất tuyển dụng, Quản lý TTS, Đánh giá |
| **HR** | Toàn bộ luồng tuyển dụng (Bước 2-10) |
| **Giám đốc** | Phê duyệt kế hoạch tuyển dụng |
| **Thực tập sinh** | Xem lộ trình học tập, Nộp báo cáo, Làm bài test |

---

## 📝 GHI CHÚ QUAN TRỌNG

### Mock Data
- Hệ thống hiện đang sử dụng **mock data** từ `src/constants/MockData.ts`
- Dữ liệu cũng được đồng bộ với `db.json` (JSON Server)

### API Backend
- Base URL: `http://localhost:3000/`
- Để chạy JSON Server: `npx json-server --watch db.json --port 3000`

### Email Templates
Hiện tại email chưa được gửi thật, chỉ hiển thị preview. Để tích hợp email thật:
1. Cấu hình SMTP server
2. Tích hợp service như SendGrid, AWS SES, hoặc Nodemailer

---

## 🚀 CÁCH CHẠY THỬ TOÀN BỘ LUỒNG

### Bước 1: Khởi động ứng dụng
```bash
yarn dev
```

### Bước 2: Đăng nhập
- Truy cập: `http://localhost:5173/login`
- Đăng nhập với tài khoản HR hoặc Admin

### Bước 3: Thực hiện theo thứ tự
1. **Mentor tạo đề xuất**: `/recruitment/mentor-requests`
2. **HR tạo kế hoạch**: `/recruitment/plans`
3. **Giám đốc duyệt**: `/director/approvals`
4. **HR đăng tin**: `/recruitment/jobs`
5. **Ứng viên nộp hồ sơ**: `/jobs` (public)
6. **HR sàng lọc**: `/candidate/cv-list`
7. **HR lên lịch PV**: `/candidate/interviews`
8. **HR cập nhật kết quả**: `/candidate/cv-detail/:id`
9. **Onboarding**: `/recruitment/onboarding`
10. **Quản lý TTS**: `/internship/interns`

---

## 📞 HỖ TRỢ

Nếu gặp vấn đề trong quá trình sử dụng:
1. Kiểm tra console log (F12)
2. Kiểm tra Network tab để xem API calls
3. Xem file `db.json` để kiểm tra dữ liệu

---

**Cập nhật lần cuối:** 2026-02-07
**Phiên bản:** 1.0
