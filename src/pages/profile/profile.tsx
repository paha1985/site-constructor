import { useState, useEffect } from "react";
import { RootState, ProfileFormData, ProfileFormErrors } from "../../types";
import { updateUser } from "../../store/actions/userActions";
import "./profile.css";
import { useAppDispatch, useAppSelector } from "../../store/hooks";

export const Profile: React.FC = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state: RootState) => state.auth);
  const { loading: userLoading, error: userError } = useAppSelector(
    (state: RootState) => state.user
  );

  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [formData, setFormData] = useState<ProfileFormData>({
    firstName: "",
    lastName: "",
    email: "",
  });
  const [errors, setErrors] = useState<ProfileFormErrors>({});
  const [successMessage, setSuccessMessage] = useState<string>("");

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
      });
    }
  }, [user]);

  const validateField = (name: keyof ProfileFormData, value: string): string => {
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
    setErrors((prev) => ({ ...prev, [name]: error }));

    if (successMessage) setSuccessMessage("");
  };

  const handleSave = async () => {
    const newErrors: ProfileFormErrors = {};
    Object.keys(formData).forEach((key) => {
      const error = validateField(key as keyof ProfileFormData, formData[key as keyof ProfileFormData]);
      if (error) newErrors[key as keyof ProfileFormData] = error;
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      await dispatch(updateUser(formData));
      setSuccessMessage("Данные успешно обновлены!");
      setIsEditing(false);
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
        console.log(err)
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
          <label>Имя:</label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            disabled={!isEditing}
            className={errors.firstName ? "error" : ""}
          />
          {errors.firstName && (
            <span className="field-error">{errors.firstName}</span>
          )}
        </div>

        <div className="profile-field">
          <label>Фамилия:</label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            disabled={!isEditing}
            className={errors.lastName ? "error" : ""}
          />
          {errors.lastName && (
            <span className="field-error">{errors.lastName}</span>
          )}
        </div>

        <div className="profile-field">
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            disabled={!isEditing}
            className={errors.email ? "error" : ""}
          />
          {errors.email && <span className="field-error">{errors.email}</span>}
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
            >
              {userLoading ? "Загрузка..." : "Редактировать"}
            </button>
          ) : (
            <>
              <button
                onClick={handleSave}
                className="btn-save"
                disabled={
                  userLoading || Object.keys(errors).some((key) => errors[key as keyof ProfileFormErrors])
                }
              >
                {userLoading ? "Сохранение..." : "Сохранить"}
              </button>
              <button
                onClick={handleCancel}
                className="btn-cancel"
                disabled={userLoading}
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