import { UserOutlined } from "@ant-design/icons";
import { Button, Form, Input, Modal } from "antd";
import { useState } from "react";
import Swal from "sweetalert2";
import api from "../../../services/api";
import useChangeAdminModalStore from "../../../stores/changeAdminModalStore";

export default function ChangeAdminModal() {
  const [form] = Form.useForm();
  const changeAdminModal = useChangeAdminModalStore(
    (state) => state.changeAdminModal
  );
  const handleChangeAdminModal = useChangeAdminModalStore(
    (state) => state.handleChangeAdminModal
  );

  const [membershipId, setMembershipId] = useState("");

  const handleInputChange = (e) => {
    setMembershipId(e.target.value);
  };

  const handleSubmit = async () => {
    try {
      const response = await api.put(`/api/users/${membershipId}`);
      console.log("User updated to admin:", response);

      Swal.fire({
        icon: "success",
        title: "Success",
        text: response.data.message,
      });

      form.resetFields();
      handleChangeAdminModal();
      setMembershipId("");
    } catch (error) {
      console.error("Error updating user to admin:", error);

      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.message || "An error occurred.",
      });
    }
  };

  return (
    <Modal
      title={null}
      footer={null}
      open={changeAdminModal}
      onCancel={handleChangeAdminModal}
    >
      <section>
        <div className="change-admin-container">
          <h3 className="text-center mb-3 font-bold text-lg">
            Change User to Admin
          </h3>
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
              label="Membership ID"
              name="membershipId"
              rules={[
                {
                  type: "text",
                  required: true,
                  message: "Please input your membership ID!",
                },
              ]}
            >
              <Input
                prefix={<UserOutlined />}
                placeholder="Enter your membership ID"
                name="membershipId"
                value={membershipId}
                onChange={handleInputChange}
              />
            </Form.Item>
            <Form.Item style={{ marginBottom: "0px" }}>
              <Button className="btn" block type="secondary" htmlType="submit">
                Update to Admin
              </Button>
            </Form.Item>
          </Form>
        </div>
      </section>
    </Modal>
  );
}
