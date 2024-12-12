import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Form, Input, Modal } from "antd";
import { useState } from "react";
import Swal from "sweetalert2";
import useAuthStore from "../../../stores/authStore";
import useLoginModalStore from "../../../stores/loginModalStore";
import useRegisterModalStore from "../../../stores/registerModalStore";
import "./LoginModal.css";

export default function LoginModal() {
  const loginModal = useLoginModalStore((state) => state.loginModal);
  const handleLoginModal = useLoginModalStore(
    (state) => state.handleLoginModal
  );
  const handleRegisterModal = useRegisterModalStore(
    (state) => state.handleRegisterModal
  );
  const login = useAuthStore((state) => state.login);
  const openRegisterModal = () => {
    handleLoginModal();
    handleRegisterModal();
  }
  const [loginPayload, setLoginPayload] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginPayload((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      await login(loginPayload.email, loginPayload.password);

      Swal.fire({
        icon: "success",
        title: "Login Successful",
        text: "You have successfully logged in!",
      });
      handleLoginModal(); // Close the modal on successful login
    } catch (error) {
      console.error("Login failed:", error);
      Swal.fire({
        icon: "error",
        title: "Login Failed",
        text: error.response?.data?.message || error.message,
      });
    }
  };

  return (
    <Modal
      title={null}
      open={loginModal}
      onCancel={handleLoginModal}
      footer={null}
    >
      <section>
        <div className="login-container">
          <h3 style={{ textAlign: "center", marginBottom: "10px" }}>Login</h3>
          <Form
            name="normal_login"
            initialValues={{
              remember: true,
            }}
            onFinish={handleSubmit}
            layout="vertical"
            requiredMark="optional"
          >
            <Form.Item
              label="Email"
              name="email"
              rules={[
                {
                  type: "email",
                  required: true,
                  message: "Please input your Email!",
                },
              ]}
            >
              <Input
                prefix={<UserOutlined />}
                placeholder="Enter your email address"
                name="email"
                value={loginPayload.email}
                onChange={handleChange}
              />
            </Form.Item>
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
                placeholder="Enter your password"
                name="password"
                value={loginPayload.password}
                onChange={handleChange}
              />
            </Form.Item>
            {/* <Form.Item>
              <div className="remember-wrapper">
                <Form.Item name="remember" valuePropName="checked" noStyle>
                  <Checkbox>Remember me</Checkbox>
                </Form.Item>
                <a href="">Forgot password?</a>
              </div>
            </Form.Item> */}
            <Form.Item style={{ marginBottom: "0px" }}>
              <Button block="true" type="primary" htmlType="submit">
                Log in
              </Button>
              <div className="login-footer-wrapper">
                <div>Don't have an account?</div>{" "}
                <div className="cursor-pointer" onClick={openRegisterModal}>Sign up now</div>
              </div>
            </Form.Item>
          </Form>
        </div>
      </section>
    </Modal>
  );
}
