[English](#english) | [فارسی](#persian) | [العربية](#arabic) | [한국어](#korean) | [中文](#chinese) | [日本語](#japanese)

---

# <a id="english"></a>🇺🇸 CXHKAS Protocol Specification
**Penguin Web Messaging - E2EE Service**

## 1. Introduction
Penguin Web Messaging operates on a dual-service architecture:
1. **Normal Chat:** High-speed, synchronized, and feature-rich messaging.
2. **E2EE Service:** Maximum security and privacy using the **CXHKAS** protocol family.

The **CXHKAS** (Comparison of X Hashes, Key Asymmetric, Symmetric) protocol family eliminates Man-in-the-Middle (MitM) attacks by utilizing a Live Video Call as an Out-of-Band (OOB) verification channel. The server is treated as untrusted (Trustless Architecture), and identity verification is performed entirely by the users.

This document defines four variants of the protocol:
- **C2HKAS:** Basic 1-on-1 secure chat (2 Hashes).
- **C3HKAS:** Basic Group secure chat (3 Hashes).
- **C4HKAS:** Advanced 1-on-1 secure chat with 2 Test Messages (4 Hashes).
- **C5HKAS:** Advanced Group secure chat with 2 Test Messages (5 Hashes).

## 2. C2HKAS (Basic 1-on-1 Chat)
**C2HKAS** stands for **C**omparison of **2** **H**ashes, **K**ey **A**symmetric, **S**ymmetric.

### 2.1. Handshake Flow
1. **Asymmetric Key Generation:** User 1 generates an Asymmetric Key Pair (Public/Private). User 2 does not need a persistent asymmetric key pair.
2. **Public Key Exchange:** User 1 sends their Public Key to User 2 through the server.
3. **Hash Comparison 1 (Root):** User 1 and User 2 initiate a Live Video Call. They compare the cryptographic hash of User 1's Public Key (e.g., an 8-character fingerprint: `B J H 7 - G 5 A R`).
4. **Symmetric Key Generation:** Once verified, User 2 generates a strong Symmetric Key (e.g., AES-256-GCM) and encrypts it using User 1's verified Public Key.
5. **Decryption & Hash Comparison 2 (Payload):** User 1 decrypts the Symmetric Key. Both users compare the hash of the Symmetric Key during the live video call.
6. **Session Established:** If both hashes match, the E2EE session is established.

## 3. C3HKAS (Basic Group Chat)
**C3HKAS** stands for **C**omparison of **3** **H**ashes, **K**ey **A**symmetric, **S**ymmetric.

C3HKAS uses a sequential Star-Topology model to ensure every member securely receives the Group Symmetric Key.

### 3.1. Handshake Flow
1. **Public Key Submission:** User 1 sends their Public Key to the Admin via the server.
2. **Root Hash Verification (Hash 1):** The Admin and User 1 initiate a Live Video Call and compare the cryptographic hash of User 1's Public Key.
3. **Symmetric Key Distribution:** The Admin encrypts the Group Symmetric Key using User 1's verified Public Key and sends it.
4. **Payload Hash Verification (Hash 2):** User 1 decrypts the Group Symmetric Key. Both the Admin and User 1 compare the hash of this Symmetric Key during the Live Video Call.
5. **Sequential Verification:** Steps 1 to 4 are repeated for every user in the group, from User 1 to User N.
6. **Final Group Verification (Hash 3):** The Admin broadcasts the final Group Symmetric Key hash to the entire group. All online users compare this broadcasted hash to ensure consistency.

## 4. C4HKAS (Advanced 1-on-1 Chat)
**C4HKAS** stands for **C**omparison of **4** **H**ashes, **K**ey **A**symmetric, **S**ymmetric.

C4HKAS is an enhanced version of C2HKAS. It includes a Challenge-Response mechanism using 2 Test Messages to prove that bidirectional encryption and decryption are fully functional.

### 4.1. Handshake Flow
1. **Root & Payload Verification:** Users perform the standard C2HKAS protocol (Hashes 1 and 2).
2. **Test Message 1 (User 1 to User 2):** User 1 encrypts a random test string (e.g., "Ping") using the newly established Symmetric Key and sends it. User 2 decrypts and verifies the message. (Hash 3)
3. **Test Message 2 (User 2 to User 1):** User 2 encrypts a random test string (e.g., "Pong") using the Symmetric Key and sends it back. User 1 decrypts and verifies the message. (Hash 4)
4. **Session Established:** If both test messages decrypt correctly, the session is confirmed secure.

## 5. C5HKAS (Advanced Group Chat)
**C5HKAS** stands for **C**omparison of **5** **H**ashes, **K**ey **A**symmetric, **S**ymmetric.

C5HKAS is an enhanced version of C3HKAS. It ensures that the Group Symmetric Key is perfectly aligned across all nodes by exchanging 2 Group Test Messages.

### 5.1. Handshake Flow
1. **Root, Payload & Final Verification:** Users perform the standard C3HKAS protocol (Hashes 1, 2, and 3).
2. **Test Message 1 (Admin to Group):** The Admin broadcasts a test message encrypted with the Group Symmetric Key. All users must decrypt and verify it. (Hash 4)
3. **Test Message 2 (Group to Admin):** One or all users encrypt a test message and send it to the group. The Admin and all other users verify it. (Hash 5)
4. **Session Established:** The Group E2EE session is fully confirmed.

## 6. Security Considerations
- **Trustless Server:** The server only acts as a relay and cannot read the Symmetric Keys.
- **Out-of-Band (OOB) Verification:** The Live Video Call is the ultimate source of truth against MitM attacks.
- **Forward Secrecy:** (Future Scope) Keys can be rotated using the Double Ratchet algorithm.

---

# <a id="persian"></a>🇮🇷 مشخصات پروتکل CXHKAS
**پیام‌رسان وب پنگوئن - سرویس E2EE**

## ۱. مقدمه
پیام‌رسان پنگوئن بر پایه یک معماری دو سرویسی کار می‌کند:
۱. **چت عادی (Normal Chat):** پیام‌رسانی پرسرعت، همگام‌سازی شده و با امکانات کامل.
۲. **سرویس E2EE:** امنیت و حریم خصوصی حداکثری با استفاده از خانواده پروتکل‌های **CXHKAS**.

پروتکل **CXHKAS** برای حذف حملات مرد میانی (MitM) با استفاده از یک تماس ویدیویی زنده به عنوان یک کانال تایید خارج از باند (OOB) طراحی شده است. سرور غیرقابل اعتماد (Trustless) در نظر گرفته می‌شود و تایید هویت کاملاً توسط کاربران انجام می‌شود.

این سند چهار نوع از این پروتکل را تعریف می‌کند:
- **C2HKAS:** چت امن یک‌به‌یک پایه (۲ هش).
- **C3HKAS:** چت امن گروهی پایه (۳ هش).
- **C4HKAS:** چت امن یک‌به‌یک پیشرفته با ۲ پیام تست (۴ هش).
- **C5HKAS:** چت امن گروهی پیشرفته با ۲ پیام تست (۵ هش).

## ۲. پروتکل C2HKAS (چت یک‌به‌یک پایه)
**C2HKAS** مخفف **مقایسه ۲ هش، کلید نامتقارن، متقارن** است.

### ۲.۱. فرآیند دست‌دادن (Handshake)
۱. **تولید کلید نامتقارن:** کاربر ۱ یک جفت کلید نامتقارن تولید می‌کند.
۲. **تبادل کلید عمومی:** کاربر ۱ کلید عمومی خود را از طریق سرور برای کاربر ۲ می‌فرستد.
۳. **مقایسه هش ۱ (ریشه):** کاربر ۱ و ۲ در تماس ویدیویی، هش کلید عمومی کاربر ۱ را مقایسه می‌کنند.
۴. **تولید کلید متقارن:** کاربر ۲ یک کلید متقارن قوی تولید کرده و با کلید عمومی کاربر ۱ رمزش می‌کند.
۵. **رمزگشایی و مقایسه هش ۲ (محتوا):** کاربر ۱ کلید را باز می‌کند. هر دو هش کلید متقارن را مقایسه می‌کنند.
۶. **برقراری نشست:** در صورت تطابق، نشست E2EE برقرار می‌شود.

## ۳. پروتکل C3HKAS (چت گروهی پایه)
**C3HKAS** مخفف **مقایسه ۳ هش، کلید نامتقارن، متقارن** است.

C3HKAS از یک مدل ستاره‌ای ترتیبی استفاده می‌کند تا هر عضو کلید گروه را امن دریافت کند.

### ۳.۱. فرآیند دست‌دادن (Handshake)
۱. **ارسال کلید عمومی:** کاربر ۱ کلید عمومی خود را به ادمین می‌فرستد.
۲. **تایید هش ریشه (هش ۱):** ادمین و کاربر ۱ در تماس ویدیویی، هش کلید عمومی را مقایسه می‌کنند.
۳. **توزیع کلید متقارن:** ادمین کلید متقارن گروه را با کلید کاربر ۱ رمز کرده و می‌فرستد.
۴. **تایید هش محتوا (هش ۲):** کاربر ۱ رمزگشایی می‌کند. هر دو هش کلید متقارن را مقایسه می‌کنند.
۵. **تایید ترتیبی:** مراحل ۱ تا ۴ برای همه کاربران تا کاربر N تکرار می‌شود.
۶. **تایید نهایی گروه (هش ۳):** ادمین هش نهایی کلید متقارن را در گروه ارسال می‌کند. همه کاربران آن را مقایسه می‌کنند.

## ۴. پروتکل C4HKAS (چت یک‌به‌یک پیشرفته)
**C4HKAS** مخفف **مقایسه ۴ هش، کلید نامتقارن، متقارن** است.

C4HKAS نسخه ارتقایافته C2HKAS است که با استفاده از ۲ پیام تست (چالش-پاسخ)، عملکرد دوطرفه رمزنگاری را اثبات می‌کند.

### ۴.۱. فرآیند دست‌دادن (Handshake)
۱. **تایید ریشه و محتوا:** کاربران پروتکل C2HKAS را انجام می‌دهند (هش ۱ و ۲).
۲. **پیام تست ۱ (کاربر ۱ به ۲):** کاربر ۱ یک پیام رندوم (مثل Ping) را با کلید متقارن رمز کرده و می‌فرستد. کاربر ۲ آن را رمزگشایی و تایید می‌کند. (هش ۳)
۳. **پیام تست ۲ (کاربر ۲ به ۱):** کاربر ۲ یک پیام رندوم (مثل Pong) را رمز کرده و می‌فرستد. کاربر ۱ آن را رمزگشایی و تایید می‌کند. (هش ۴)
۴. **برقراری نشست:** در صورت تایید پیام‌های تست، نشست کاملاً امن تایید می‌شود.

## ۵. پروتکل C5HKAS (چت گروهی پیشرفته)
**C5HKAS** مخفف **مقایسه ۵ هش، کلید نامتقارن، متقارن** است.

C5HKAS نسخه ارتقایافته C3HKAS است که با تبادل ۲ پیام تست گروهی، اطمینان حاصل می‌کند کلید در همه گره‌ها یکسان است.

### ۵.۱. فرآیند دست‌دادن (Handshake)
۱. **تایید ریشه، محتوا و نهایی:** کاربران پروتکل C3HKAS را انجام می‌دهند (هش ۱، ۲ و ۳).
۲. **پیام تست ۱ (ادمین به گروه):** ادمین یک پیام تست رمزنگاری‌شده با کلید گروه می‌فرستد. همه کاربران باید آن را رمزگشایی و تایید کنند. (هش ۴)
۳. **پیام تست ۲ (گروه به ادمین):** یک یا همه کاربران یک پیام تست رمز کرده و به گروه می‌فرستند. ادمین و بقیه آن را تایید می‌کنند. (هش ۵)
۴. **برقراری نشست:** نشست E2EE گروهی کاملاً تایید می‌شود.

## ۶. ملاحظات امنیتی
- **سرور بدون اعتماد:** سرور فقط نقش رله را دارد و نمی‌تواند کلیدها را بخواند.
- **تایید خارج از باند (OOB):** تماس ویدیویی زنده، منبع نهایی حقیقت است.
- **رازداری رو به جلو:** (برای آینده) کلیدها با الگوریتم Double Ratchet چرخش پیدا می‌کنند.

---

# <a id="arabic"></a>🇸🇦 مواصفات بروتوكول CXHKAS
**مراسلة الويب Penguin - خدمة E2EE**

## 1. مقدمة
يعمل Penguin Web Messaging على بنية ذات خدمتين: 1. الدردشة العادية. 2. خدمة E2EE (أقصى درجات الأمان باستخدام CXHKAS).

تم تصميم عائلة بروتوكول **CXHKAS** للقضاء على هجمات الوسيط (MitM) باستخدام مكالمة فيديو مباشرة كقناة تحقق خارج النطاق (OOB). يتم التعامل مع الخادم على أنه غير موثوق، ويتم التحقق من الهوية بالكامل بواسطة المستخدمين.

يحدد هذا المستند أربعة أنواع من البروتوكول:
- **C2HKAS:** دردشة فردية أساسية (تجزئتان).
- **C3HKAS:** دردشة جماعية أساسية (3 تجزئات).
- **C4HKAS:** دردشة فردية متقدمة مع رسالتي اختبار (4 تجزئات).
- **C5HKAS:** دردشة جماعية متقدمة مع رسالتي اختبار (5 تجزئات).

## 2. C2HKAS (دردشة فردية أساسية)
**C2HKAS** تعني **م**قارنة **2** **ت**جزئة، **م**فتاح **غ**ير متماثل، **م**تماثل.

### 2.1. تدفق المصافحة
1. **توليد مفتاح غير متماثل:** يقوم المستخدم 1 بإنشاء زوج مفاتيح.
2. **تبادل المفتاح العام:** يرسل المستخدم 1 مفتاحه العام إلى المستخدم 2 عبر الخادم.
3. **مقارنة التجزئة 1 (الجذر):** يقارن المستخدم 1 و 2 التجزئة عبر مكالمة فيديو مباشرة.
4. **توليد مفتاح متماثل:** يقوم المستخدم 2 بإنشاء مفتاح متماثل وتشفيره بالمفتاح العام للمستخدم 1.
5. **فك التشفير ومقارنة التجزئة 2:** يقوم المستخدم 1 بفك التشفير. يقارن كلا المستخدمين تجزئة المفتاح المتماثل.
6. **تأسيس الجلسة:** إذا تطابقت التجزئتان، يتم تأسيس جلسة E2EE.

## 3. C3HKAS (دردشة جماعية أساسية)
**C3HKAS** تعني **م**قارنة **3** **ت**جزئات، **م**فتاح **غ**ير متماثل، **م**تماثل.

يستخدم C3HKAS نموذجاً تسلسلياً بنجمة لضمان حصول كل عضو على المفتاح المتماثل بأمان.

### 3.1. تدفق المصافحة
1. **إرسال المفتاح العام:** يرسل المستخدم 1 مفتاحه العام إلى المسؤول.
2. **التحقق من تجزئة الجذر (التجزئة 1):** يقارن المسؤول والمستخدم 1 التجزئة عبر مكالمة فيديو.
3. **توزيع المفتاح المتماثل:** يقوم المسؤول بتشفير المفتاح المتماثل ويرسله للمستخدم 1.
4. **التحقق من تجزئة الحمولة (التجزئة 2):** يقوم المستخدم 1 بفك التشفير ويقارنان التجزئة.
5. **التحقق التسلسلي:** تتكرر الخطوات 1-4 لكل مستخدم حتى المستخدم N.
6. **التحقق النهائي (التجزئة 3):** يبث المسؤول التجزئة النهائية للمجموعة ليتحقق منها الجميع.

## 4. C4HKAS (دردشة فردية متقدمة)
**C4HKAS** تعني **م**قارنة **4** **ت**جزئات، **م**فتاح **غ**ير متماثل، **م**تماثل.

C4HKAS هي نسخة محسنة من C2HKAS. تتضمن رسالتي اختبار (تحدي واستجابة) لإثبات أن التشفير وفك التشفير ثنائي الاتجاه يعملان بشكل كامل.

### 4.1. تدفق المصافحة
1. **التحقق من الجذر والحمولة:** يقوم المستخدمون بإجراء C2HKAS (تجزئتان 1 و 2).
2. **رسالة الاختبار 1 (من 1 إلى 2):** يقوم المستخدم 1 بتشفير نص عشوائي (مثل "Ping") وإرساله. يقوم المستخدم 2 بفك تشفيره والتحقق منه. (تجزئة 3)
3. **رسالة الاختبار 2 (من 2 إلى 1):** يقوم المستخدم 2 بتشفير نص عشوائي (مثل "Pong") وإرساله. يقوم المستخدم 1 بفك تشفيره والتحقق منه. (تجزئة 4)
4. **تأسيس الجلسة:** إذا تم فك تشفير كلتا الرسالتين بشكل صحيح، يتم تأكيد أمان الجلسة.

## 5. C5HKAS (دردشة جماعية متقدمة)
**C5HKAS** تعني **م**قارنة **5** **ت**جزئات، **م**فتاح **غ**ير متماثل، **م**تماثل.

C5HKAS هي نسخة محسنة من C3HKAS. تضمن أن المفتاح المتماثل للمجموعة متطابق تماماً عبر جميع العقد من خلال تبادل رسالتي اختبار.

### 5.1. تدفق المصافحة
1. **التحقق من الجذر والحمولة والنهائي:** يقوم المستخدمون بإجراء C3HKAS (تجزئات 1، 2، 3).
2. **رسالة الاختبار 1 (من المسؤول إلى المجموعة):** يبث المسؤول رسالة اختبار مشفرة. يجب على جميع المستخدمين فك تشفيرها والتحقق منها. (تجزئة 4)
3. **رسالة الاختبار 2 (من المجموعة إلى المسؤول):** يقوم مستخدم واحد أو جميعهم بتشفير رسالة اختبار وإرسالها. يتحقق المسؤول والآخرون منها. (تجزئة 5)
4. **تأسيس الجلسة:** تم تأكيد جلسة E2EE الجماعية بالكامل.

## 6. اعتبارات أمنية
- **خادم غير موثوق:** يعمل الخادم فقط كمرحل.
- **التحقق خارج النطاق (OOB):** مكالمة الفيديو المباشرة هي المصدر النهائي للحقيقة.
- **السرية الأمامية:** (نطاق مستقبلي) يمكن تدوير المفاتيح.

---

# <a id="korean"></a>🇰🇷 CXHKAS 프로토콜 사양
**Penguin Web Messaging - E2EE 서비스**

## 1. 소개
이중 서비스 아키텍처: 1. 일반 채팅. 2. E2EE 서비스 (CXHKAS 제품군 사용).

**CXHKAS** 제품군은 실시간 화상 통화를 대역 외(OOB) 검증 채널로 활용하여 중간자(MitM) 공격을 제거합니다. 서버는 신뢰할 수 없는 것으로 간주되며, 신원 확인은 전적으로 사용자에 의해 수행됩니다.

이 문서는 4가지 변형을 정의합니다:
- **C2HKAS:** 기본 1대1 (2 해시).
- **C3HKAS:** 기본 그룹 (3 해시).
- **C4HKAS:** 고급 1대1 + 2개 테스트 메시지 (4 해시).
- **C5HKAS:** 고급 그룹 + 2개 테스트 메시지 (5 해시).

## 2. C2HKAS (기본 1대1)
**C2HKAS**는 **2**개의 **H**ash(해시), **A**symmetric(비대칭) **K**ey(키), **S**ymmetric(대칭) **K**ey(키)의 **C**omparison(비교)입니다.

### 2.1. 핸드셰이크
1. **비대칭 키 생성:** 사용자 1이 키 쌍을 생성합니다.
2. **공개 키 교환:** 사용자 1이 서버를 통해 공개 키를 보냅니다.
3. **해시 비교 1 (루트):** 화상 통화를 통해 공개 키 해시를 비교합니다.
4. **대칭 키 생성:** 사용자 2가 대칭 키를 생성하고 사용자 1의 공개 키로 암호화합니다.
5. **해시 비교 2 (페이로드):** 사용자 1이 복호화하고 대칭 키 해시를 비교합니다.
6. **세션 설정:** 해시가 일치하면 E2EE 세션이 설정됩니다.

## 3. C3HKAS (기본 그룹)
**C3HKAS**는 **3**개의 **H**ash(해시), **A**symmetric(비대칭) **K**ey(키), **S**ymmetric(대칭) **K**ey(키)의 **C**omparison(비교)입니다.

C3HKAS는 순차적 스타 토폴로지 모델을 사용하여 모든 구성원이 그룹 대칭 키를 안전하게 받도록 보장합니다.

### 3.1. 핸드셰이크
1. **공개 키 제출:** 사용자 1이 관리자에게 공개 키를 보냅니다.
2. **루트 해시 확인 (해시 1):** 화상 통화를 통해 공개 키 해시를 확인합니다.
3. **대칭 키 배포:** 관리자가 그룹 대칭 키를 암호화하여 보냅니다.
4. **페이로드 해시 확인 (해시 2):** 사용자 1이 복호화하고 대칭 키 해시를 비교합니다.
5. **순차적 확인:** 사용자 N까지 1-4단계를 반복합니다.
6. **최종 그룹 확인 (해시 3):** 관리자가 최종 해시를 브로드캐스트하고 모두 확인합니다.

## 4. C4HKAS (고급 1대1)
**C4HKAS**는 **4**개의 **H**ash(해시), **A**symmetric(비대칭) **K**ey(키), **S**ymmetric(대칭) **K**ey(키)의 **C**omparison(비교)입니다.

C4HKAS는 C2HKAS의 향상된 버전입니다. 양방향 암호화가 완벽하게 작동함을 증명하기 위해 2개의 테스트 메시지를 사용하는 챌린지-응답 메커니즘을 포함합니다.

### 4.1. 핸드셰이크
1. **루트 및 페이로드 확인:** C2HKAS를 수행합니다 (해시 1, 2).
2. **테스트 메시지 1 (1에서 2로):** 사용자 1이 "Ping"을 암호화하여 보냅니다. 사용자 2가 복호화합니다. (해시 3)
3. **테스트 메시지 2 (2에서 1로):** 사용자 2가 "Pong"을 암호화하여 보냅니다. 사용자 1이 복호화합니다. (해시 4)
4. **세션 설정:** 두 메시지가 올바르게 복호화되면 보안이 확인됩니다.

## 5. C5HKAS (고급 그룹)
**C5HKAS**는 **5**개의 **H**ash(해시), **A**symmetric(비대칭) **K**ey(키), **S**ymmetric(대칭) **K**ey(키)의 **C**omparison(비교)입니다.

C5HKAS는 C3HKAS의 향상된 버전입니다. 2개의 그룹 테스트 메시지를 교환하여 그룹 대칭 키가 모든 노드에서 완벽하게 일치하는지 확인합니다.

### 5.1. 핸드셰이크
1. **루트, 페이로드 및 최종 확인:** C3HKAS를 수행합니다 (해시 1, 2, 3).
2. **테스트 메시지 1 (관리자에서 그룹으로):** 관리자가 테스트 메시지를 브로드캐스트합니다. 모든 사용자가 복호화하고 확인합니다. (해시 4)
3. **테스트 메시지 2 (그룹에서 관리자로):** 사용자가 테스트 메시지를 암호화하여 그룹에 보냅니다. 관리자와 다른 사용자가 확인합니다. (해시 5)
4. **세션 설정:** 그룹 E2EE 세션이 완전히 확인됩니다.

## 6. 보안 고려 사항
- **신뢰할 수 없는 서버:** 서버는 릴레이 역할만 합니다.
- **대역 외(OOB) 검증:** 실시간 화상 통화는 궁극적인 진실의 원천입니다.
- **전방 비밀성 (Forward Secrecy):** (향후 범위) 키는 Double Ratchet으로 교체될 수 있습니다.

---

# <a id="chinese"></a>🇨🇳 CXHKAS 协议规范
**企鹅网络通讯 - E2EE 服务**

## 1. 简介
双服务架构：1. 普通聊天。2. E2EE 服务（使用 CXHKAS 协议系列）。

**CXHKAS** 协议系列通过利用实时视频通话作为带外 (OOB) 验证通道来消除中间人 (MitM) 攻击。服务器被视为不受信任，身份验证完全由用户执行。

本文档定义了该协议的四种变体：
- **C2HKAS:** 基础 1 对 1（2 个哈希）。
- **C3HKAS:** 基础群组（3 个哈希）。
- **C4HKAS:** 高级 1 对 1 + 2 条测试消息（4 个哈希）。
- **C5HKAS:** 高级群组 + 2 条测试消息（5 个哈希）。

## 2. C2HKAS (基础 1 对 1)
**C2HKAS** 代表 **比**较 **2** 个 **哈**希、**非**对称密钥、**对**称密钥。

### 2.1. 握手流程
1. **生成密钥:** 用户 1 生成非对称密钥对。
2. **交换公钥:** 用户 1 发送公钥。
3. **哈希 1 (根):** 通过视频通话比较公钥哈希。
4. **生成对称密钥:** 用户 2 生成对称密钥并加密。
5. **哈希 2 (载荷):** 用户 1 解密，双方比较对称密钥哈希。
6. **建立会话:** 哈希匹配，会话建立。

## 3. C3HKAS (基础群组)
**C3HKAS** 代表 **比**较 **3** 个 **哈**希、**非**对称密钥、**对**称密钥。

C3HKAS 使用顺序星型拓扑模型来确保每个成员安全地接收群组对称密钥。

### 3.1. 握手流程
1. **提交公钥:** 用户 1 发送公钥给管理员。
2. **根哈希验证 (哈希 1):** 视频通话比较公钥哈希。
3. **分发对称密钥:** 管理员加密群组密钥并发送。
4. **载荷哈希验证 (哈希 2):** 用户 1 解密，双方比较哈希。
5. **顺序循环:** 对直到用户 N 的每个用户重复步骤 1-4。
6. **最终群组验证 (哈希 3):** 管理员广播最终哈希，所有人验证。

## 4. C4HKAS (高级 1 对 1)
**C4HKAS** 代表 **比**较 **4** 个 **哈**希、**非**对称密钥、**对**称密钥。

C4HKAS 是 C2HKAS 的增强版。它包含使用 2 条测试消息的质询-响应机制，以证明双向加密完全正常。

### 4.1. 握手流程
1. **根和载荷验证:** 执行 C2HKAS（哈希 1 和 2）。
2. **测试消息 1 (1 到 2):** 用户 1 加密 "Ping" 并发送，用户 2 解密。 (哈希 3)
3. **测试消息 2 (2 到 1):** 用户 2 加密 "Pong" 并发送，用户 1 解密。 (哈希 4)
4. **建立会话:** 测试消息验证通过，确认安全。

## 5. C5HKAS (高级群组)
**C5HKAS** 代表 **比**较 **5** 个 **哈**希、**非**对称密钥、**对**称密钥。

C5HKAS 是 C3HKAS 的增强版。它通过交换 2 条群组测试消息，确保群组对称密钥在所有节点上完美一致。

### 5.1. 握手流程
1. **根、载荷和最终验证:** 执行 C3HKAS（哈希 1、2、3）。
2. **测试消息 1 (管理员到群组):** 管理员广播测试消息。所有用户必须解密并验证。 (哈希 4)
3. **测试消息 2 (群组到管理员):** 用户加密测试消息发送到群组。管理员和其他用户验证。 (哈希 5)
4. **建立会话:** 群组 E2EE 会话完全确认。

## 6. 安全注意事项
- **无信任服务器:** 服务器仅充当中继。
- **带外 (OOB) 验证:** 实时视频通话是最终事实来源。
- **前向保密:** （未来范围）可使用 Double Ratchet 轮换密钥。

---

# <a id="japanese"></a>🇯🇵 CXHKAS プロトコル仕様
**Penguin Web Messaging - E2EEサービス**

## 1. はじめに
デュアルサービスアーキテクチャ：1. 通常チャット。2. E2EEサービス（CXHKASプロトコルファミリー）。

**CXHKAS** プロトコルファミリーは、ライブビデオ通話をアウトオブバンド（OOB）検証チャネルとして利用することで、中間者（MitM）攻撃を排除します。サーバーは信頼できないものとして扱われ、本人確認は完全にユーザーによって行われます。

このドキュメントでは4つのバリエーションを定義しています：
- **C2HKAS:** 基本 1対1（2つのハッシュ）。
- **C3HKAS:** 基本 グループ（3つのハッシュ）。
- **C4HKAS:** 高度 1対1 + 2つのテストメッセージ（4つのハッシュ）。
- **C5HKAS:** 高度 グループ + 2つのテストメッセージ（5つのハッシュ）。

## 2. C2HKAS（基本 1対1）
**C2HKAS**は、**2**つの**H**ash（ハッシュ）の**C**omparison（比較）、**A**symmetric（非対称）**K**ey（鍵）、**S**ymmetric（対称）**K**ey（鍵）の略です。

### 2.1. ハンドシェイク
1. **非対称鍵の生成:** ユーザー1が鍵ペアを生成します。
2. **公開鍵の交換:** ユーザー1が公開鍵を送信します。
3. **ハッシュ1（ルート）:** ビデオ通話で公開鍵ハッシュを比較します。
4. **対称鍵の生成:** ユーザー2が対称鍵を生成し暗号化します。
5. **ハッシュ2（ペイロード）:** ユーザー1が復号化し、ハッシュを比較します。
6. **セッションの確立:** ハッシュが一致すれば確立されます。

## 3. C3HKAS（基本グループ）
**C3HKAS**は、**3**つの**H**ash（ハッシュ）の**C**omparison（比較）、**A**symmetric（非対称）**K**ey（鍵）、**S**ymmetric（対称）**K**ey（鍵）の略です。

C3HKASは順次スター型トポロジモデルを使用して、すべてのメンバーがグループ対称鍵を安全に受け取れるようにします。

### 3.1. ハンドシェイク
1. **公開鍵の提出:** ユーザー1が管理者に公開鍵を送信します。
2. **ルートハッシュの検証（ハッシュ1）:** ビデオ通話で公開鍵ハッシュを比較します。
3. **対称鍵の配布:** 管理者がグループ対称鍵を暗号化して送信します。
4. **ペイロードハッシュの検証（ハッシュ2）:** ユーザー1が復号化し、ハッシュを比較します。
5. **順次検証:** ユーザーNまでステップ1〜4を繰り返します。
6. **最終グループ検証（ハッシュ3）:** 管理者が最終ハッシュをブロードキャストし、全員が確認します。

## 4. C4HKAS（高度 1対1）
**C4HKAS**は、**4**つの**H**ash（ハッシュ）の**C**omparison（比較）、**A**symmetric（非対称）**K**ey（鍵）、**S**ymmetric（対称）**K**ey（鍵）の略です。

C4HKASはC2HKASの拡張版です。双方向の暗号化が完全に機能することを証明するため、2つのテストメッセージを使用したチャレンジ・レスポンスメカニズムを含みます。

### 4.1. ハンドシェイク
1. **ルートとペイロードの検証:** C2HKASを実行します（ハッシュ1、2）。
2. **テストメッセージ1（1から2へ）:** ユーザー1が「Ping」を暗号化して送信し、ユーザー2が復号化します。（ハッシュ3）
3. **テストメッセージ2（2から1へ）:** ユーザー2が「Pong」を暗号化して送信し、ユーザー1が復号化します。（ハッシュ4）
4. **セッションの確立:** 両方のメッセージが正しく復号化されれば、安全が確認されます。

## 5. C5HKAS（高度グループ）
**C5HKAS**は、**5**つの**H**ash（ハッシュ）の**C**omparison（比較）、**A**symmetric（非対称）**K**ey（鍵）、**S**ymmetric（対称）**K**ey（鍵）の略です。

C5HKASはC3HKASの拡張版です。2つのグループテストメッセージを交換することで、グループ対称鍵がすべてのノードで完全に一致することを保証します。

### 5.1. ハンドシェイク
1. **ルート、ペイロード、最終検証:** C3HKASを実行します（ハッシュ1、2、3）。
2. **テストメッセージ1（管理者からグループへ）:** 管理者がテストメッセージをブロードキャストします。すべてのユーザーが復号化して確認します。（ハッシュ4）
3. **テストメッセージ2（グループから管理者へ）:** ユーザーがテストメッセージを暗号化してグループに送信します。管理者と他のユーザーが確認します。（ハッシュ5）
4. **セッションの確立:** グループE2EEセッションが完全に確認されます。

## 6. セキュリティに関する考慮事項
- **トラストレスサーバー:** サーバーはリレーとしてのみ機能します。
- **アウトオブバンド（OOB）検証:** ライブビデオ通話は究極の真実の情報源です。
- **前方秘匿性 (Forward Secrecy):** （将来の範囲）鍵はDouble Ratchetでローテーションできます。
