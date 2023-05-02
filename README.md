# Square Platform Project CN322

วัตถุประสงค์เพื่อสร้างแพลตฟอร์มโซเชียลเน็ตเวิร์คเพื่อนำมาศึกษาและวิเคราะห์ถึงความปลอดภัยบนเครือข่ายคอมพิวเตอร์

![TechStack](images/techstack.png)

#### Authentication
* สร้างการเข้าสู่ระบบด้วยรหัสผ่าน
*	สร้างการยืนยันตัวตนสองชั้น 2FA ด้วย TOTP + Google Authenticator 
*	บังคับให้สร้างบัญชีใหม่ด้วยรหัสผ่านที่เเข็งเเรง และมีความยาวอย่างน้อย 8 ตัวอักษร
*	สร้างระบบ Email verificationผู้ใช้งานที่สร้างบัญชีใหม่ต้องทำการยืนยัน Email ก่อนถึงจะสามารถเข้าสู่ระบบได้
*	ใช้งาน JWT(json web token)

#### Chatroom
*	มีการตรวจสอบสิทธิ์ในการเข้าห้องเเชท 
*	มีการEncrypt Message Chat ด้วย Publish key & Private key

#### Database
*	มีการ เข้ารหัส รหัสผ่านด้วย Bcrypt ก่อนเก็บลง Database 


## Setup
create DataBase in MongoDB

create .env file in nodejs_auth

```bash
MONGODB_URI=mongodb+srv://admin:(.....password)@cluster0.muk5ke6.mongodb.net/?retryWrites=true&w=majority
PORT=5000

TOKEN_KEY=38hrlkd8hkhhgffvgb
TOKEN_EXPIRY=365d

AUTH_EMAIL=(email)@gmail.com
AUTH_PASS=kqocynsbuvbnx(password)
```

setup backend server

```bash
cd nodejs_auth
npm install
npm run dev
```

setup frontend server

```bash
cd front
cd myapp
npm install
npm run start
```




## Demo video

[Demo](https://www.youtube.com/watch?v=SJ7jnZie-w0)
