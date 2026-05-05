"use client";
import { useState } from "react";
import styles from "../styles/CustomPhoneInput.module.css";

const phoneRules = {
  SA: {
    code: "+966",
    regex: /^5[03456789]\d{7}$/,
    name: "السعودية",
    flag: "🇸🇦",
    hint: "يبدأ بـ 5 ويتكون من 9 أرقام",
  },
  TR: {
    code: "+90",
    regex: /^5\d{9}$/,
    name: "تركيا",
    flag: "🇹🇷",
    hint: "يبدأ بـ 5 ويتكون من 10 أرقام",
  },
  SY: {
    code: "+963",
    regex: /^9[345689]\d{7}$/,
    name: "سوريا",
    flag: "🇸🇾",
    hint: "يبدأ بـ 9 ويتكون من 9 أرقام",
  },
  LB: {
    code: "+961",
    regex: /^(3\d{6}|7[01689]\d{6}|81\d{6})$/,
    name: "لبنان",
    flag: "🇱🇧",
    hint: "يبدأ بـ 3 أو 7 أو 81 (7 أو 8 أرقام)",
  },
  JO: {
    code: "+962",
    regex: /^7[789]\d{7}$/,
    name: "الأردن",
    flag: "🇯🇴",
    hint: "يبدأ بـ 77, 78, 79 ويتكون من 9 أرقام",
  },
  PS: {
    code: "+970",
    regex: /^5[69]\d{7}$/,
    name: "فلسطين",
    flag: "🇵🇸",
    hint: "يبدأ بـ 56 أو 59 ويتكون من 9 أرقام",
  },
  IQ: {
    code: "+964",
    regex: /^7[3-9]\d{8}$/,
    name: "العراق",
    flag: "🇮🇶",
    hint: "يبدأ بـ 7 ويتكون من 10 أرقام",
  },
  EG: {
    code: "+20",
    regex: /^1[0125]\d{8}$/,
    name: "مصر",
    flag: "🇪🇬",
    hint: "يبدأ بـ 10, 11, 12, 15 ويتكون من 10 أرقام",
  },
  DE: {
    code: "+49",
    regex: /^1[567]\d{8,9}$/,
    name: "ألمانيا",
    flag: "🇩🇪",
    hint: "يبدأ بـ 15, 16, 17 (10 أو 11 رقم)",
  },
};

const countries = Object.entries(phoneRules).map(([code, data]) => ({
  cca2: code,
  callingCode: data.code.replace("+", ""),
  name: data.name,
  flag: data.flag,
}));

export default function CustomPhoneInput({ onChangeData }) {
  const [countryCode, setCountryCode] = useState("SY");
  const [callingCode, setCallingCode] = useState("963");
  const [showPicker, setShowPicker] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [validationMsg, setValidationMsg] = useState(null);

  const validateAndSendData = (number, cCode) => {
    const cleanNumber = number.replace(/\D/g, "").replace(/^0/, "");
    const rules = phoneRules[cCode];
    let isValid = false;

    if (cleanNumber.length === 0) {
      setValidationMsg(null);
    } else if (rules && !rules.regex.test(cleanNumber)) {
      setValidationMsg(`❌ خطأ: ${rules.hint}`);
    } else {
      setValidationMsg("✅ رقم هاتف صالح");
      isValid = true;
    }

    if (onChangeData) {
      onChangeData({
        phoneNumber: cleanNumber,
        callingCode: rules.code,
        fullNumber: rules.code + cleanNumber,
        isValid: isValid,
      });
    }
  };

  const selectCountry = (country) => {
    setCountryCode(country.cca2);
    setCallingCode(country.callingCode);
    setShowPicker(false);
    validateAndSendData(phoneNumber, country.cca2);
  };

  const currentFlag = phoneRules[countryCode]?.flag;

  return (
    <div className={styles.wrapper}>
      <label className={styles.label}>رقم الجوال</label>

      <div
        className={`${styles.inputContainer} ${
          validationMsg?.includes("❌") ? styles.inputError : ""
        } ${validationMsg?.includes("✅") ? styles.inputSuccess : ""}`}
      >
        {/* زر اختيار الدولة */}
        <button
          type='button'
          className={styles.countryBox}
          onClick={() => setShowPicker(true)}
        >
          <span className={styles.chevron}>▼</span>
          <span className={styles.callingCode}>+{callingCode}</span>
          <span className={styles.flagIcon}>{currentFlag}</span>
        </button>

        <div className={styles.divider} />

        {/* حقل الإدخال */}
        <input
          className={styles.input}
          type='tel'
          placeholder='أدخل رقم الجوال'
          value={phoneNumber}
          onChange={(e) => {
            const clean = e.target.value.replace(/[^0-9]/g, "");
            setPhoneNumber(clean);
            validateAndSendData(clean, countryCode);
          }}
          maxLength={15}
        />
      </div>

      {/* رسالة التحقق */}
      {validationMsg && (
        <p
          className={styles.validationText}
          style={{
            color: validationMsg.includes("✅") ? "#16A34A" : "#DC2626",
          }}
        >
          {validationMsg}
        </p>
      )}

      {/* مودال (نافذة منبثقة) لاختيار الدولة */}
      {showPicker && (
        <div
          className={styles.modalOverlay}
          onClick={() => setShowPicker(false)}
        >
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()} // منع إغلاق النافذة عند النقر بداخلها
          >
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>اختر الدولة</h3>
            </div>

            <div className={styles.countriesList}>
              {countries.map((item) => (
                <button
                  key={item.cca2}
                  className={styles.countryItem}
                  onClick={() => selectCountry(item)}
                >
                  <span className={styles.countryItemCode}>
                    +{item.callingCode}
                  </span>
                  <div className={styles.countryItemNameContainer}>
                    <span className={styles.countryItemName}>{item.name}</span>
                    <span className={styles.countryItemFlag}>{item.flag}</span>
                  </div>
                </button>
              ))}
            </div>

            <button
              className={styles.modalClose}
              onClick={() => setShowPicker(false)}
            >
              إلغاء
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
