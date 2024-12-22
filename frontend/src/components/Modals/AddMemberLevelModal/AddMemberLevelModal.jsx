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
  const {
    addMembershipLevel,
    loading,
    fetchAllMembershipLevels,
    membershipLevels,
  } = useMembershipLevelStore();

  const handleSubmit = async (values) => {
    try {
      await addMembershipLevel(values);
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Membership level added successfully.",
      });
      handleMemberhipLevelModal();
      fetchAllMembershipLevels();
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
      title={null}
      footer={null}
      open={membershipLevelModal}
      onCancel={handleMemberhipLevelModal}
    >
      <h3 className="text-center mb-3 font-bold text-lg">
        Add Membership Level
      </h3>
      <Form
        form={form}
        onFinish={handleSubmit}
        layout="vertical"
        initialValues={{
          membershipLevel:
            membershipLevels === undefined ? 1 : membershipLevels?.length + 1,
        }}
      >
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
          <Input type="number" disabled />
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
          label="Base Points"
          name="basePoints"
          rules={[
            {
              required: true,
              message: "Please input the requirements base points amount!",
            },
          ]}
        >
          <Input type="number" />
        </Form.Item>
        <Form.Item
          label="Transfer Fee Amount"
          name="transferFee"
          rules={[
            {
              required: true,
              message: "Please input the requirements transfer fee amount!",
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
          <Button
            className="btn w-full"
            type="secondary"
            htmlType="submit"
            loading={loading}
          >
            Add
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
}
