# 📝 Task Management System

## Mô tả

Task Management System là một ứng dụng web cho phép người dùng cá nhân hoặc nhóm nhỏ quản lý công việc một cách trực quan và hiệu quả. Ứng dụng hỗ trợ tạo, theo dõi và cập nhật tiến độ công việc theo giao diện dạng Kanban board. Ngoài ra, hệ thống còn hỗ trợ thông báo nhắc nhở deadline và phân quyền truy cập.

---

## 🚀 Công nghệ sử dụng

### 💻 Backend
- Java 17
- Spring Boot
- Spring Security (JWT + OAuth2)
- Hibernate + JPA (ORM)
- MySQL
- RESTful API

### 🌐 Frontend
- Angular 20
- Angular Router
- JWT + OAuth2 Authentication
- Bootstrap hoặc Angular Material (tuỳ chọn)

---

## 📁 Cấu trúc thư mục dự án

```text
task-management-system/
│
├── backend/
│   ├── src/
│   │   ├── main/java/com/example/taskmanagement/
│   │   │   ├── controller/               # REST controllers
│   │   │   ├── dto/                      # Data Transfer Objects
│   │   │   ├── entity/                   # JPA entities
│   │   │   ├── repository/               # Spring Data JPA Repositories
│   │   │   ├── security/                 # JWT, security config
│   │   │   ├── service/                  # Business logic
│   │   │   └── TaskManagementApplication.java  # Main class
│   │   └── resources/
│   │       └── application.properties    # DB & App configuration
│   └── pom.xml                           # Maven build file
│
├── frontend/
│   └── task-management-angular/
│       ├── src/
│       │   ├── app/
│       │   │   ├── core/
│       │   │   │   ├── guards/
│       │   │   │   │   └── module-import-guard.ts
│       │   │   │   ├── interceptor/
│       │   │   │   │   ├── error-interceptor.ts
│       │   │   │   │   └── jwt-interceptor.ts
│       │   │   │   ├── models/
│       │   │   │   │   ├── user.model.ts
│       │   │   │   │   └── task.model.ts
│       │   │   │   ├── services/
│       │   │   │   │   ├── app-init.service.ts
│       │   │   │   │   └── router-reuse.strategy.ts
│       │   │   ├── modules/
│       │   │   │   ├── feature-one/
│       │   │   │   │   ├── components/
│       │   │   │   │   │   ├── component1/
│       │   │   │   │   │   ├── component2/
│       │   │   │   │   │   └── component3/
│       │   │   │   │   ├── containers/
│       │   │   │   │   │   ├── container1/
│       │   │   │   │   │   ├── container2/
│       │   │   │   │   │   └── container3/
│       │   │   │   │   ├── pages/
│       │   │   │   │   │   └── page1/
│       │   │   │   │   └── feature-one-routing.module.ts
│       │   │   │   │
│       │   │   │   ├── feature-two/
│       │   │   │   ├── feature-three/
│       │   │   │
│       │   │   ├── shared/
│       │   │   │   ├── modules/
│       │   │   │   │   ├── primeng.module.ts
│       │   │   │   │   ├── material.module.ts
│       │   │   │   │   └── *.module.ts
│       │   │   │   ├── components/
│       │   │   │   │   └── *.component.ts
│       │   │   │   ├── directives/
│       │   │   │   │   └── *.directive.ts
│       │   │   │   └── pipes/
│       │   │   │       └── *.pipe.ts
│       │
│       │   └── environments/
│       └── angular.json                  # Angular config
│
└── README.md                             # Project overview



## 🔐 Xác thực & Phân quyền

- **Authentication:**
  - Hỗ trợ JWT (JSON Web Token)
  - OAuth2 (Google login)

- **Authorization:**
  - Role-based access: `USER`, `ADMIN`
  - Các chức năng được phân quyền theo vai trò

---

## 🛠️ Tính năng chính

| Tính năng                        | Mô tả                                                                 |
|----------------------------------|-----------------------------------------------------------------------|
| 📝 Tạo / Chỉnh sửa / Xóa Task    | Cho phép người dùng thao tác CRUD với công việc                      |
| ⏰ Gán deadline và độ ưu tiên     | Hỗ trợ quản lý deadline và độ quan trọng của công việc              |
| 🔁 Theo dõi tiến độ              | Các trạng thái: `To-Do`, `In Progress`, `Done`                       |
| 🗂️ Kanban Board UI               | Giao diện trực quan chia cột theo tiến độ công việc                  |
| 🔔 Nhắc nhở deadline             | Tích hợp chức năng gửi thông báo khi gần tới deadline (tuỳ chọn)     |
| 👤 Đăng ký / Đăng nhập           | Hệ thống xác thực người dùng qua JWT/OAuth2                         |

---
