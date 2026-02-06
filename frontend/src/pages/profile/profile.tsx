import { useState, useEffect } from "react";
import {
  ProfileFormData,
  ProfileFormErrors,
  UpdateUserData,
} from "../../types";
import { updateUser } from "../../store/actions/userActions";
import "./profile.css";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { UserWithoutPassword } from "@/store/actions/authActions";
import { RootState } from "../../store";
interface ProfileUser extends UserWithoutPassword {
  createdAt?: string;
  siteCount?: number;
}

interface ProfileProps {}

export const Profile: React.FC<ProfileProps> = () => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [formData, setFormData] = useState<ProfileFormData>({
    firstName: "",
    lastName: "",
    email: "",
  });
  const [errors, setErrors] = useState<ProfileFormErrors>({});
  const [successMessage, setSuccessMessage] = useState<string>("");

  const { loading: userLoading, error: userError } = useAppSelector(
    (state: RootState) => state.user,
  );
  const { user: authUser } = useAppSelector((state: RootState) => state.auth);
  const user: ProfileUser | null = authUser as ProfileUser;
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
      });
    }
  }, [user]);

  const validateField = (
    name: keyof ProfileFormData,
    value: string,
  ): string => {
    switch (name) {
      case "firstName":
        if (!value.trim()) return "Имя обязательно";
        if (value.length < 2) return "Имя должно быть не менее 2 символов";
        return "";
      case "lastName":
        if (!value.trim()) return "Фамилия обязательна";
        if (value.length < 2) return "Фамилия должна быть не менее 2 символов";
        return "";
      case "email":
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value.trim()) return "Email обязателен";
        if (!emailRegex.test(value)) return "Неверный формат email";
        return "";
      default:
        return "";
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    const error = validateField(name as keyof ProfileFormData, value);
    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));

    if (successMessage) setSuccessMessage("");
  };

  const validateForm = (): boolean => {
    const newErrors: ProfileFormErrors = {};

    (Object.keys(formData) as Array<keyof ProfileFormData>).forEach((key) => {
      const error = validateField(key, formData[key]);
      if (error) {
        newErrors[key] = error;
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return false;
    }

    setErrors({});
    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      await dispatch(
        updateUser({
          ...formData,
          user_id: user?.id,
        } as UpdateUserData),
      );

      setSuccessMessage("Данные успешно обновлены!");
      setIsEditing(false);
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      console.error("Непредвиденная ошибка:", err);
    }
  };

  const handleCancel = () => {
    if (user) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
      });
    }
    setErrors({});
    setIsEditing(false);
    setSuccessMessage("");
  };

  const hasErrors = (): boolean => {
    return Object.values(errors).some((error) => error !== "");
  };

  if (!user) {
    return (
      <div className="profile-container">
        <div className="loading">Загрузка профиля...</div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <h1>Профиль пользователя</h1>

      <div className="profile-card">
        {successMessage && (
          <div className="success-message">{successMessage}</div>
        )}

        {userError && <div className="error-message">{userError}</div>}

        <div className="profile-field">
          <label htmlFor="firstName">Имя:</label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            disabled={!isEditing}
            className={errors.firstName ? "error" : ""}
            aria-invalid={!!errors.firstName}
            aria-describedby={errors.firstName ? "firstName-error" : undefined}
          />
          {errors.firstName && (
            <span id="firstName-error" className="field-error">
              {errors.firstName}
            </span>
          )}
        </div>

        <div className="profile-field">
          <label htmlFor="lastName">Фамилия:</label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            disabled={!isEditing}
            className={errors.lastName ? "error" : ""}
            aria-invalid={!!errors.lastName}
            aria-describedby={errors.lastName ? "lastName-error" : undefined}
          />
          {errors.lastName && (
            <span id="lastName-error" className="field-error">
              {errors.lastName}
            </span>
          )}
        </div>

        <div className="profile-field">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            disabled={!isEditing}
            className={errors.email ? "error" : ""}
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "email-error" : undefined}
          />
          {errors.email && (
            <span id="email-error" className="field-error">
              {errors.email}
            </span>
          )}
        </div>

        <div className="profile-stats">
          <div className="stat-item">
            <span className="stat-label">Дата регистрации:</span>
            <span className="stat-value">
              {user.createdAt
                ? new Date(user.createdAt).toLocaleDateString("ru-RU")
                : "Не указана"}
            </span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Количество сайтов:</span>
            <span className="stat-value">{user.siteCount || 0}</span>
          </div>
        </div>

        <div className="profile-actions">
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="btn-edit"
              disabled={userLoading}
              type="button"
            >
              {userLoading ? "Загрузка..." : "Редактировать"}
            </button>
          ) : (
            <>
              <button
                onClick={handleSave}
                className="btn-save"
                disabled={userLoading || hasErrors()}
                type="button"
              >
                {userLoading ? "Сохранение..." : "Сохранить"}
              </button>
              <button
                onClick={handleCancel}
                className="btn-cancel"
                disabled={userLoading}
                type="button"
              >
                Отмена
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
