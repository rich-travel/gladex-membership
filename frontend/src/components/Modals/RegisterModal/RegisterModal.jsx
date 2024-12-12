import {
  LockOutlined,
  MailOutlined,
  PhoneOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Button, Form, Input, Modal } from "antd";
import { useState } from "react";
import Swal from "sweetalert2";
import { postData } from "../../../services/api";
import useLoginModalStore from "../../../stores/loginModalStore";
import useRegisterModalStore from "../../../stores/registerModalStore";
import "./RegisterModal.css";

export default function RegisterModal() {
  const [form] = Form.useForm();
  const registerModal = useRegisterModalStore((state) => state.registerModal);
  const handleLoginModal = useLoginModalStore(
    (state) => state.handleLoginModal
  );
  const handleRegisterModal = useRegisterModalStore(
    (state) => state.handleRegisterModal
  );

  const openLoginModal = () => {
    handleRegisterModal();
    handleLoginModal();
  };

  const initialRegisterPayload = {
    membershipId: "",
    firstName: "",
    middleName: "",
    lastName: "",
    email: "",
    mobileNumber: "",
    isAdmin: false,
    password: "",
    confirmPassword: "",
  };

  const [registerPayload, setRegisterPayload] = useState(
    initialRegisterPayload
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRegisterPayload((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    if (registerPayload.password !== registerPayload.confirmPassword) {
      return Swal.fire({
        icon: "error",
        title: "Password Mismatch",
        text: "Passwords do not match. Please try again.",
      });
    }
    try {
      const response = await postData("/api/users/register", registerPayload);
      console.log("Registration successful:", response);
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "User registered successfully.",
      }).then(() => {
        setRegisterPayload(initialRegisterPayload); // Reset the state
        form.resetFields(); // Reset the form fields
        handleRegisterModal(); // Close the register modal
        handleLoginModal(); // Open the login modal
      });
    } catch (error) {
      console.error("Registration failed:", error);
      Swal.fire({
        icon: "error",
        title: "Register Failed",
        text: error.response?.data?.message || error.message,
      });
    }
  };

  return (
    <Modal
      title={null}
      open={registerModal}
      onCancel={handleRegisterModal}
      footer={null}
    >
      <section>
        <div className="login-container">
          <h3 style={{ textAlign: "center", marginBottom: "10px" }}>Sign up</h3>
          <Form
            form={form}
            name="normal_register"
            initialValues={{
              remember: true,
            }}
            onFinish={handleSubmit}
            layout="vertical"
            requiredMark="optional"
          >
            {/* First Name */}
            <Form.Item
              label="First Name"
              name="firstName"
              rules={[
                {
                  required: true,
                  message: "Please input your First Name!",
                },
              ]}
            >
              <Input
                prefix={<UserOutlined />}
                placeholder="First Name"
                name="firstName"
                value={registerPayload.firstName}
                onChange={handleChange}
              />
            </Form.Item>

            {/* Middle Name */}
            <Form.Item label="Middle Name" name="middleName">
              <Input
                prefix={<UserOutlined />}
                placeholder="Middle Name"
                name="middleName"
                value={registerPayload.middleName}
                onChange={handleChange}
              />
            </Form.Item>

            {/* Last Name */}
            <Form.Item
              label="Last Name"
              name="lastName"
              rules={[
                {
                  required: true,
                  message: "Please input your Last Name!",
                },
              ]}
            >
              <Input
                prefix={<UserOutlined />}
                placeholder="Last Name"
                name="lastName"
                value={registerPayload.lastName}
                onChange={handleChange}
              />
            </Form.Item>

            {/* Cellphone Number */}
            <Form.Item
              label="Cellphone Number"
              name="mobileNumber"
              rules={[
                {
                  required: true,
                  message: "Please input your Cellphone Number!",
                },
              ]}
            >
              <Input
                prefix={<PhoneOutlined />}
                placeholder="Cellphone Number"
                name="mobileNumber"
                value={registerPayload.mobileNumber}
                onChange={handleChange}
              />
            </Form.Item>

            {/* Email Address */}
            <Form.Item
              label="Email Address"
              name="email"
              rules={[
                {
                  type: "email",
                  required: true,
                  message: "Please input your Email Address!",
                },
              ]}
            >
              <Input
                prefix={<MailOutlined />}
                placeholder="Email Address"
                name="email"
                value={registerPayload.email}
                onChange={handleChange}
              />
            </Form.Item>

            {/* Password */}
            <Form.Item
              label="Password"
              name="password"
              rules={[
                {
                  required: true,
                  message: "Please input your Password!",
                },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                type="password"
                placeholder="Password"
                name="password"
                value={registerPayload.password}
                onChange={handleChange}
              />
            </Form.Item>

            {/* Confirm Password */}
            <Form.Item
              label="Confirm Password"
              name="confirmPassword"
              rules={[
                {
                  required: true,
                  message: "Please confirm your Password!",
                },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                type="password"
                placeholder="Confirm Password"
                name="confirmPassword"
                value={registerPayload.confirmPassword}
                onChange={handleChange}
              />
            </Form.Item>

            <Form.Item style={{ marginBottom: "0px" }}>
              <Button block type="primary" htmlType="submit">
                Sign up
              </Button>
              <div className="login-footer-wrapper">
                <div>Already a Member?</div>
                <div className="cursor-pointer" onClick={openLoginModal}>
                  Login here
                </div>
              </div>
            </Form.Item>
          </Form>
        </div>
      </section>
    </Modal>
  );
}
