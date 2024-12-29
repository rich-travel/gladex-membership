import { Button, Form, Input, Modal } from "antd";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import Swal from "sweetalert2";
import useEditMembershipLevelModalStore from "../../../stores/editMembershipLevelModalStore";
import useMembershipLevelStore from "../../../stores/membershipLevelStore";

export default function EditMemberLevelModal() {
  const editMembershipLevelModal = useEditMembershipLevelModalStore(
    (state) => state.editMembershipLevelModal
  );
  const handleEditMembershipLevelModal = useEditMembershipLevelModalStore(
    (state) => state.handleEditMembershipLevelModal
  );
  const editingMembershipLevel = useEditMembershipLevelModalStore(
    (state) => state.editingMembershipLevel
  );

  const { editMembershipLevel, fetchAllMembershipLevels } =
    useMembershipLevelStore();

  const handleEdit = async (values) => {
    try {
      await editMembershipLevel(editingMembershipLevel._id, values);
      handleEditMembershipLevelModal(false);
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Membership level updated successfully.",
      });
      fetchAllMembershipLevels();
    } catch (error) {
      console.error("Failed to edit membership level:", error);
    }
  };

  return (
    <Modal
      title={null}
      footer={null}
      open={editMembershipLevelModal}
      onCancel={() => handleEditMembershipLevelModal(false)}
    >
      <h3 className="text-center mb-3 font-bold text-lg">
        Edit Membership Level
      </h3>
      <Form
        initialValues={editingMembershipLevel}
        onFinish={handleEdit}
        layout="vertical"
      >
        <Form.Item
          name="membershipName"
          label="Membership Name"
          rules={[
            { required: true, message: "Please input the membership name!" },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="membershipLevel"
          label="Membership Level"
          rules={[
            { required: true, message: "Please input the membership level!" },
          ]}
        >
          <Input type="number" />
        </Form.Item>
        <Form.Item
          name="requirementsAmount"
          label="Requirements Amount"
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
          name="benefits"
          label="Benefits"
          rules={[{ required: true, message: "Please input the benefits!" }]}
        >
          <ReactQuill theme="snow" />
        </Form.Item>
        <Form.Item
          name="basePoints"
          label="Base Points"
          rules={[{ required: true, message: "Please input the base points!" }]}
        >
          <Input type="number" />
        </Form.Item>
        <Form.Item
          name="transferFee"
          label="Transfer Fee"
          rules={[
            { required: true, message: "Please input the transfer fee!" },
          ]}
        >
          <Input type="number" />
        </Form.Item>
        <Form.Item>
          <Button className="btn w-full" type="secondary" htmlType="submit">
            Save
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
}
