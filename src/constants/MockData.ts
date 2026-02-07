export const MOCK_DATA = {
    accounts: [
        {
            _id: "1",
            fullName: "Admin Hệ Thống",
            email: "admin@tts-learning.com",
            phone: "0901234567",
            role_id: "admin",
            status: "active",
            createdAt: "2025-01-01T08:00:00",
            updatedAt: "2025-01-01T08:00:00"
        },
        {
            _id: "2",
            fullName: "Nguyễn Văn Mentor",
            email: "mentor1@tts-learning.com",
            phone: "0912345678",
            role_id: "mentor",
            status: "active",
            createdAt: "2025-02-01T10:30:00",
            updatedAt: "2025-02-01T10:30:00"
        }
    ],
    recruitmentPlans: [
        {
            id: "1",
            name: "Kế hoạch Tuyển dụng Hè 2025",
            batch: "Batch 2025-A",
            department: "Engineering",
            startDate: "2025-03-01",
            endDate: "2025-08-31",
            description: "Tuyển thực tập sinh cho các mảng FE, BE, Mobile tại TP.HCM và Hà Nội",
            status: "Active",
            candidates: 45,
            createdAt: "2025-01-10T08:00:00",
            updatedAt: "2025-01-10T08:00:00"
        },
        {
            id: "2",
            name: "Đào tạo Fresher Marketing Q1/2026",
            batch: "Marketing-2026-Q1",
            department: "Marketing",
            startDate: "2026-01-01",
            endDate: "2026-06-30",
            description: "Chương trình đào tạo chuyên sâu về Performance Marketing",
            status: "Pending",
            candidates: 12,
            createdAt: "2025-11-15T10:30:00",
            updatedAt: "2025-11-15T10:30:00"
        },
        {
            id: "3",
            name: "Tuyển dụng UI/UX Design Spring 2025",
            batch: "Design-25-S1",
            department: "Design",
            startDate: "2025-02-01",
            endDate: "2025-05-30",
            description: "Tìm kiếm tài năng thiết kế giao diện trẻ",
            status: "Closed",
            candidates: 20,
            createdAt: "2024-12-20T09:00:00",
            updatedAt: "2025-02-01T14:00:00"
        }
    ],
    jobPositions: [
        {
            id: "JOB-001",
            title: "Frontend (ReactJS) Intern",
            campaign: "Kế hoạch Tuyển dụng Hè 2025",
            campaignId: "1",
            department: "Engineering",
            level: "Intern",
            required: 15,
            filled: 6,
            status: "Open",
            postedDate: "2025-02-15",
            description: "Làm việc với ReactJS, Next.js, TailwindCSS. Tham gia phát triển các dashboard quản trị.",
            requirements: "Ưu tiên sinh viên năm 3-4, biết HTML/CSS/JS cơ bản. Có tư duy logic tốt.",
            location: "Thành phố Hồ Chí Minh",
            salary: "3tr - 5tr VNĐ",
            createdAt: "2025-02-15T08:00:00",
            updatedAt: "2025-02-15T08:00:00"
        },
        {
            id: "JOB-002",
            title: "Backend (NodeJS) Intern",
            campaign: "Kế hoạch Tuyển dụng Hè 2025",
            campaignId: "1",
            department: "Engineering",
            level: "Intern",
            required: 10,
            filled: 4,
            status: "Open",
            postedDate: "2025-02-20",
            description: "Xây dựng hệ thống RESTful API bằng NodeJS/Express. Làm việc với MongoDB/PostgreSQL.",
            requirements: "Biết xử lý bất đồng bộ trong JS. Hiểu cơ bản về Database.",
            location: "Hà Nội / Remote",
            salary: "3tr - 5tr VNĐ",
            createdAt: "2025-02-20T09:00:00",
            updatedAt: "2025-02-20T09:00:00"
        },
        {
            id: "JOB-003",
            title: "Mobile App (Flutter) Intern",
            campaign: "Kế hoạch Tuyển dụng Hè 2025",
            campaignId: "1",
            department: "Engineering",
            level: "Intern",
            required: 5,
            filled: 2,
            status: "Open",
            postedDate: "2025-02-25",
            description: "Phát triển ứng dụng Mobile đa nền tảng bằng Flutter.",
            requirements: "Yêu thích lập trình di động. Có kiến thức về Dart là lợi thế.",
            location: "Thành phố Hồ Chí Minh",
            salary: "3tr - 5tr VNĐ",
            createdAt: "2025-02-25T10:00:00",
            updatedAt: "2025-02-25T10:00:00"
        }
    ],
    candidates: [
        {
            id: "CAN-001",
            name: "Nguyễn Hoàng Nam",
            email: "nam.nh@student.hust.edu.vn",
            phone: "0987654321",
            location: "Hà Nội",
            avatar: "https://i.pravatar.cc/150?u=CAN-001",
            role: "Backend (NodeJS) Intern",
            education: "Đại học Bách Khoa Hà Nội (Năm 4)",
            experience: "Làm project cá nhân về E-commerce",
            skills: ["JavaScript", "NodeJS", "MongoDB", "Docker"],
            resumeUrl: "#",
            appliedDate: "2025-03-01",
            appliedFor: "JOB-002",
            appliedForTitle: "Backend (NodeJS) Intern",
            status: "Shortlisted",
            matchScore: 88,
            timeAgo: "2 ngày trước",
            coverLetter: "Em mong muốn được thực tập tại công ty để trau dồi kỹ năng về Microservices...",
            createdAt: "2025-03-01T08:00:00",
            updatedAt: "2025-03-02T10:00:00"
        },
        {
            id: "CAN-002",
            name: "Lê Thị Thu Thảo",
            email: "thao.ltt@uit.edu.vn",
            phone: "0977889900",
            location: "TP. Hồ Chí Minh",
            avatar: "https://i.pravatar.cc/150?u=CAN-002",
            role: "Frontend (ReactJS) Intern",
            education: "Đại học Công nghệ Thông tin - ĐHQG TP.HCM",
            experience: "Thực tập ngắn hạn tại startup X",
            skills: ["React", "Tailwind", "TypeScript"],
            resumeUrl: "#",
            appliedDate: "2025-03-05",
            appliedFor: "JOB-001",
            appliedForTitle: "Frontend (ReactJS) Intern",
            status: "CV Screened",
            matchScore: 95,
            timeAgo: "5 giờ trước",
            coverLetter: "Em có niềm đam mê với việc xây dựng giao diện người dùng đẹp và tối ưu...",
            createdAt: "2025-03-05T09:00:00",
            updatedAt: "2025-03-05T09:00:00"
        },
        {
            id: "CAN-003",
            name: "Trần Minh Quân",
            email: "quan.tm@example.com",
            phone: "0911223344",
            location: "Đà Nẵng",
            avatar: "https://i.pravatar.cc/150?u=CAN-003",
            role: "Mobile App (Flutter) Intern",
            education: "Đại học Bách Khoa Đà Nẵng",
            experience: "Fresher",
            skills: ["Dart", "Flutter", "Firebase"],
            resumeUrl: "#",
            appliedDate: "2025-03-04",
            appliedFor: "JOB-003",
            appliedForTitle: "Mobile App (Flutter) Intern",
            status: "Pending Review",
            matchScore: 72,
            timeAgo: "1 ngày trước",
            coverLetter: "Em muốn thử sức với mảng Cross-platform...",
            createdAt: "2025-03-04T11:00:00",
            updatedAt: "2025-03-04T11:00:00"
        }
    ],
    interns: [
        {
            id: "ITS-001",
            name: "Phạm Minh Đức",
            avatar: "https://i.pravatar.cc/150?u=ITS-001",
            email: "duc.pm@example.com",
            phone: "0900112233",
            track: "Frontend Development",
            mentor: "Nguyễn Văn Mentor",
            startDate: "2025-01-15",
            endDate: "2025-04-15",
            progress: 65,
            status: "Active",
            createdAt: "2025-01-15T08:00:00",
            updatedAt: "2025-03-01T10:00:00"
        },
        {
            id: "ITS-002",
            name: "Hoàng Thu Hà",
            avatar: "https://i.pravatar.cc/150?u=ITS-002",
            email: "ha.ht@example.com",
            phone: "0900112244",
            track: "Backend Development",
            mentor: "Lê Vũ Anh (Senior BE)",
            startDate: "2025-02-01",
            endDate: "2025-05-01",
            progress: 30,
            status: "Active",
            createdAt: "2025-02-01T09:00:00",
            updatedAt: "2025-03-01T10:00:00"
        }
    ],
    tasks: [
        {
            id: "TSK-201",
            title: "Xây dựng màn hình Dashboard Mockup",
            intern: "Phạm Minh Đức",
            internId: "ITS-001",
            internAvatar: "https://i.pravatar.cc/150?u=ITS-001",
            priority: "High",
            dueDate: "2025-03-20",
            status: "In Progress",
            description: "Sử dụng Ant Design để dựng layout dashboard chính.",
            createdAt: "2025-03-01T08:00:00",
            updatedAt: "2025-03-05T10:00:00"
        },
        {
            id: "TSK-202",
            title: "Viết Unit Test cho Auth Service",
            intern: "Hoàng Thu Hà",
            internId: "ITS-002",
            internAvatar: "https://i.pravatar.cc/150?u=ITS-002",
            priority: "Medium",
            dueDate: "2025-03-25",
            status: "To Do",
            description: "Đảm bảo coverage đạt trên 80% cho các hàm xử lý logic đăng nhập.",
            createdAt: "2025-03-05T09:00:00",
            updatedAt: "2025-03-05T09:00:00"
        }
    ],
    interviews: [
        {
            id: "1",
            candidateId: "CAN-002",
            candidateName: "Lê Thị Thu Thảo",
            jobId: "JOB-001",
            jobTitle: "Frontend (ReactJS) Intern",
            date: "2025-03-15",
            time: "14:00",
            duration: "45 min",
            format: "Online",
            location: "Google Meet",
            interviewer: "Nguyễn Văn Mentor",
            status: "Scheduled",
            notes: "Phỏng vấn kỹ thuật React cơ bản",
            createdAt: "2025-03-10T08:00:00",
            updatedAt: "2025-03-10T08:00:00"
        }
    ],
    approvals: [
        {
            id: "1",
            type: "Recruitment",
            name: "Kế hoạch Hè 2025",
            title: "Đề xuất mở rộng slot thực tập sinh cho team AI",
            department: "Engineering",
            hr: "Trần Thị HR",
            priority: "High",
            status: "Pending",
            createdAt: "2025-03-06T10:30:00",
            updatedAt: "2025-03-06T10:30:00"
        }
    ],
    onboarding: [
        {
            id: "ONB-001",
            name: "Lý Văn Hòa",
            avatar: "https://i.pravatar.cc/150?u=123",
            track: "Mobile App (Flutter)",
            currentStep: 1,
            startDate: "2025-03-12",
            status: "In Progress",
            steps: [
                { title: "Bổ sung hồ sơ", status: "finish" },
                { title: "Cấp tài khoản & Email", status: "process" },
                { title: "Đào tạo nhập môn", status: "wait" },
                { title: "Giao Task đầu tiên", status: "wait" }
            ],
            createdAt: "2025-03-01T08:00:00",
            updatedAt: "2025-03-06T11:00:00"
        }
    ],
    evaluations: [
        {
            id: "EVL-201",
            internId: "ITS-001",
            internName: "Phạm Minh Đức",
            mentorId: "MEN-001",
            mentorName: "Nguyễn Văn Mentor",
            type: "Knowledge-test",
            score: 85,
            feedback: "Kết quả bài test ReactJS tốt, cần chú ý thêm về tối ưu render.",
            status: "Completed",
            date: "2025-03-01",
            createdAt: "2025-03-01T15:00:00",
            updatedAt: "2025-03-01T15:00:00"
        }
    ],
    reports: [
        {
            id: "REP-201",
            internId: "ITS-001",
            title: "Báo cáo Tuần 3 - Tháng 2",
            type: "Weekly",
            period: "Tuần 3 - Feb 2025",
            submittedAt: "2025-02-21",
            status: "Approved",
            score: 90,
            feedback: "Báo cáo chi tiết, nắm vững quy trình làm việc của team.",
            content: "Đã hoàn thành module đăng nhập và tích hợp API xác thực.",
            challenges: "Gặp khó khăn khi xử lý Refresh Token, đã được mentor hỗ trợ.",
            nextPlan: "Tiếp tục làm module Dashboard.",
            createdAt: "2025-02-21T17:00:00",
            updatedAt: "2025-02-22T08:00:00"
        }
    ],
    learningPaths: [
        {
            id: "LP-001",
            track: "Frontend Development",
            modules: [
                {
                    id: 1,
                    title: "Văn hóa Công ty & Onboarding",
                    status: "Ready",
                    description: "Giới thiệu văn hóa, các công cụ làm việc và quy trình dự án.",
                    progress: 100,
                    items: [
                        { id: 1, type: "video", title: "CEO Welcome & Company Vision", meta: "Link Video • 10 phút" },
                        { id: 2, type: "file", title: "Sổ tay nhân viên 2025", meta: "PDF • 5 MB" }
                    ]
                },
                {
                    id: 2,
                    title: "ReactJS Cơ bản đến Nâng cao",
                    status: "In Progress",
                    description: "Hooks, State Management, routing và tối ưu hiệu năng.",
                    progress: 45,
                    items: [
                        { id: 3, type: "file", title: "React Design Patterns", meta: "Ebook • 2 MB" }
                    ]
                }
            ]
        }
    ],
    dashboardStats: {
        totalUsers: 50,
        activeUsers: 35,
        todayVisits: 120,
        openPositions: 8,
        pendingApplications: 25,
        upcomingInterviews: 5,
        activeInterns: 15,
        pendingReviews: 10,
        conversionRate: 22
    }
};
