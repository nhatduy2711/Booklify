// src/pages/UserInfo.jsx
import React, { useEffect, useState } from "react";
import {
  Card,
  Row,
  Col,
  Avatar,
  Upload,
  Button,
  Form,
  Input,
  Space,
  Typography,
  Breadcrumb,
  message,
  Empty,
} from "antd";
import { UploadOutlined, HomeOutlined, UserOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { callUpdateInfoUser, callFetchAccount } from "../../services/api"; // ⬅️ API
import { doGetAccountAction } from "../../redux/account/accountSlice"; // ⬅️ Redux

const { Title, Text } = Typography;

const UserInfo = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [form] = Form.useForm();

  // Redux state
  const { user, isAuthenticated } = useSelector((state) => state.account);

  // Avatar preview và giá trị gửi lên API
  const [avatarUrl, setAvatarUrl] = useState("");
  const [avatarValue, setAvatarValue] = useState(""); // gửi field "avatar"
  const [saving, setSaving] = useState(false);

  // Đổ dữ liệu từ Redux vào Form
  useEffect(() => {
    if (user) {
      form.setFieldsValue({
        id: user.id || "",
        fullName: user.fullName || "",
        phone: user.phone || "",
      });

      const url = user?.avatar
        ? `${import.meta.env.VITE_BACKEND_URL}/images/avatar/${user.avatar}`
        : "";
      setAvatarUrl(url);
      setAvatarValue(user?.avatar || "");
    }
  }, [user, form]);

  const beforeUpload = (file) => {
    if (!file.type.startsWith("image/")) {
      message.error("Chỉ được chọn file ảnh!");
      return Upload.LIST_IGNORE;
    }
    const objectUrl = URL.createObjectURL(file);
    setAvatarUrl(objectUrl);
    setAvatarValue(file.name);
    message.success("Đã chọn avatar (preview). Ảnh sẽ được lưu khi Update.");
    return Upload.LIST_IGNORE;
  };

  const onFinish = async (values) => {
    try {
      setSaving(true);

      await callUpdateInfoUser(
        user.id,
        values.fullName?.trim(),
        values.phone?.trim(),
        avatarValue
      );

      message.success("Cập nhật thông tin thành công");

      const optimisticUser = {
        ...user,
        fullName: values.fullName?.trim(),
        phone: values.phone?.trim(),
        avatar: avatarValue || user.avatar,
      };
      dispatch(doGetAccountAction({ user: optimisticUser }));

      form.setFieldsValue({
        id: optimisticUser.id,
        fullName: optimisticUser.fullName,
        phone: optimisticUser.phone,
      });
      if (optimisticUser.avatar) {
        setAvatarUrl(
          `${import.meta.env.VITE_BACKEND_URL}/images/avatar/${
            optimisticUser.avatar
          }?v=${Date.now()}`
        );
      }
    } catch (e) {
      console.error(e);
      message.error("Cập nhật thất bại");
    } finally {
      setSaving(false);
    }
  };

  // Guard: chưa đăng nhập
  if (!isAuthenticated || !user) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 16,
          background: "#f5f5f5",
        }}
      >
        <Empty description="Chưa có thông tin người dùng">
          <Button type="primary" onClick={() => navigate("/login")}>
            Đăng nhập
          </Button>
        </Empty>
      </div>
    );
  }

  const initials =
    user.fullName
      ?.trim()
      ?.split(" ")
      ?.map((w) => w[0])
      .slice(-2)
      .join("")
      ?.toUpperCase() || "U";

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f5f5f5",
        padding: "24px 16px",
      }}
    >
      <Breadcrumb
        style={{ marginBottom: 16 }}
        items={[
          {
            title: (
              <Link to="/">
                <HomeOutlined /> Trang chủ
              </Link>
            ),
          },
          {
            title: (
              <>
                <UserOutlined /> Thông tin người dùng
              </>
            ),
          },
        ]}
      />

      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <Title level={3} style={{ marginBottom: 16 }}>
          User Info
        </Title>

        <Row gutter={[16, 16]}>
          <Col xs={24} md={8}>
            <Card>
              <Space
                direction="vertical"
                align="center"
                style={{ width: "100%" }}
              >
                <Avatar
                  size={120}
                  src={avatarUrl || undefined}
                  style={{ backgroundColor: "#1677ff", fontSize: 36 }}
                >
                  {!avatarUrl && initials}
                </Avatar>

                <Upload
                  showUploadList={false}
                  accept="image/*"
                  beforeUpload={beforeUpload}
                >
                  <Button icon={<UploadOutlined />}>Update Avatar</Button>
                </Upload>

                <Text type="secondary" style={{ textAlign: "center" }}>
                  Ảnh sẽ được lưu khi bấm “Update”.
                </Text>
              </Space>
            </Card>
          </Col>

          <Col xs={24} md={16}>
            <Card>
              <Form
                layout="vertical"
                form={form}
                onFinish={onFinish}
                autoComplete="off"
              >
                <Form.Item label="ID" name="id">
                  <Input disabled />
                </Form.Item>

                <Form.Item
                  label="Full name"
                  name="fullName"
                  rules={[
                    { required: true, message: "Please enter full name" },
                    { min: 2, message: "Name is too short" },
                  ]}
                >
                  <Input placeholder="Nguyễn Văn A" />
                </Form.Item>

                <Form.Item
                  label="Phone"
                  name="phone"
                  rules={[
                    { required: true, message: "Please enter phone" },
                    {
                      pattern: /^[0-9+\-()\s]{8,20}$/,
                      message: "Invalid phone number",
                    },
                  ]}
                >
                  <Input placeholder="090..." />
                </Form.Item>

                <Space>
                  <Button type="primary" htmlType="submit" loading={saving}>
                    Update
                  </Button>
                </Space>
              </Form>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default UserInfo;
