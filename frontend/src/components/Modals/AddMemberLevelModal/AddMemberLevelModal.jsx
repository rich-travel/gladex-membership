import { Button, Form, Input, Modal } from "antd";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import Swal from "sweetalert2";
import useMembershipLevelModalStore from "../../../stores/membershipLevelModalStore";
import useMembershipLevelStore from "../../../stores/membershipLevelStore";

export default function AddMemberLevelModal() {
  const [form] = Form.useForm();
  const membershipLevelModal = useMembershipLevelModalStore(
    (state) => state.membershipLevelModal
  );
  const handleMemberhipLevelModal = useMembershipLevelModalStore(
    (state) => state.handleMemberhipLevelModal
  );
  const { addMembershipLevel, loading } = useMembershipLevelStore();

  const handleSubmit = async (values) => {
    try {
      await addMembershipLevel(values);
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Membership level added successfully.",
      });
      handleMemberhipLevelModal();
      form.resetFields();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.message || error.message,
      });
    }
  };

  return (
    <Modal
      title="Add Membership Level"
      footer={null}
      open={membershipLevelModal}
      onCancel={handleMemberhipLevelModal}
    >
      <Form form={form} onFinish={handleSubmit} layout="vertical">
        <Form.Item
          label="Membership Name"
          name="membershipName"
          rules={[
            { required: true, message: "Please input the membership name!" },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Membership Level"
          name="membershipLevel"
          rules={[
            { required: true, message: "Please input the membership level!" },
          ]}
        >
          <Input type="number" />
        </Form.Item>
        <Form.Item
          label="Requirements Amount"
          name="requirementsAmount"
          rules={[
            {
              required: true,
              message: "Please input the requirements amount!",
            },
          ]}
        >
          <Input type="number" />
        </Form.Item>
        <Form.Item
          label="Benefits"
          name="benefits"
          rules={[{ required: true, message: "Please input the benefits!" }]}
        >
          <ReactQuill theme="snow" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Add
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
}
