"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./Login.module.css";
import CustomPhoneInput from "../component/CustomPhoneInput";
// import CustomPhoneInput from "./CustomPhoneInput"; // استدعاء الكومبوننت الجديد

export default function LoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // حفظ بيانات الهاتف القادمة من الكومبوننت
  const [phoneData, setPhoneData] = useState({
    phoneNumber: "",
    fullNumber: "",
    isValid: false,
  });

  const handleLogin = async () => {
    if (!phoneData.isValid || !password) {
      alert("الرجاء إدخال رقم هاتف صحيح وكلمة المرور");
      return;
    }

    setLoading(true);

    // تسجيل الدخول التجريبي
    setTimeout(() => {
      console.log("Logging in with:", phoneData.fullNumber, password);
      setLoading(false);
      router.push("/");
    }, 1500);
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>تسجيل الدخول</h1>

        {/* استدعاء مكون رقم الجوال الجديد */}
        <CustomPhoneInput onChangeData={(data) => setPhoneData(data)} />

        <div className={styles.inputGroup}>
          <input
            type='password'
            placeholder='كلمة المرور'
            className={styles.input}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
          />
        </div>

        <button
          onClick={handleLogin}
          disabled={loading}
          className={styles.button}
        >
          {loading ? "جاري تسجيل الدخول..." : "دخول"}
        </button>
      </div>
    </div>
  );
}
