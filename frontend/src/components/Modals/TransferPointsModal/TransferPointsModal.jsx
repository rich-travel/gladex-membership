import { UserOutlined, DollarOutlined } from "@ant-design/icons";
import { Button, Form, Input, Modal } from "antd";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import useTransferPointsModalStore from "../../../stores/transferPointsModalStore";
import useAuthStore from "../../../stores/authStore";
import useTransferPointsStore from "../../../stores/transferPointsStore";

export default function TransferPointsModal() {
  const [form] = Form.useForm();
  const { user } = useAuthStore();
  const transferPointsModal = useTransferPointsModalStore(
    (state) => state.transferPointsModal
  );
  const handleTransferPointsModal = useTransferPointsModalStore(
    (state) => state.handleTransferPointsModal
  );
  const fetchUserInfo = useAuthStore((state) => state.fetchUserInfo);
  const { transferPoints, loading, error } = useTransferPointsStore();

  const [transferPointsPayload, setTransferPointsPayload] = useState({
    fromMembershipId: user?.membershipId,
    toMembershipId: "",
    points: "",
  });

  const { fetchTransferHistory} = useTransferPointsStore();

  useEffect(() => {
    setTransferPointsPayload((prev) => ({
      ...prev,
      fromMembershipId: user?.membershipId,
    }));
    form.setFieldsValue({ fromMembershipId: user?.membershipId });
  }, [user, form]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTransferPointsPayload((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      await transferPoints(
        transferPointsPayload.fromMembershipId,
        transferPointsPayload.toMembershipId,
        transferPointsPayload.points
      );

      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Points transferred successfully.",
      });
      fetchUserInfo(user?.membershipId);
      fetchTransferHistory(user?.membershipId);
      handleTransferPointsModal();
      form.resetFields(); // Reset the form fields
      setTransferPointsPayload({
        fromMembershipId: user?.membershipId,
        toMembershipId: "",
        points: "",
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Transfer Failed",
        text: error.response?.data?.message || error.message,
      });
    }
  };

  return (
    <Modal
      title={null}
      footer={null}
      open={transferPointsModal}
      onCancel={handleTransferPointsModal}
    >
      <section>
        <div className="change-admin-container">
          <h3 style={{ textAlign: "center", marginBottom: "10px" }}>
            Transfer Points
          </h3>
          <Form
            form={form}
            name="transfer_points"
            initialValues={{
              fromMembershipId: user?.membershipId,
            }}
            onFinish={handleSubmit}
            layout="vertical"
            requiredMark="optional"
          >
            <Form.Item
              label="My Membership ID"
              name="fromMembershipId"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Input
                prefix={<UserOutlined />}
                placeholder="Enter your membership ID"
                name="fromMembershipId"
                value={transferPointsPayload.fromMembershipId}
                onChange={handleChange}
                disabled
              />
            </Form.Item>
            <Form.Item
              label="To Membership ID"
              name="toMembershipId"
              rules={[
                {
                  required: true,
                  message: "Please input the recipient's membership ID!",
                },
              ]}
            >
              <Input
                prefix={<UserOutlined />}
                placeholder="Enter recipient's membership ID"
                name="toMembershipId"
                value={transferPointsPayload.toMembershipId}
                onChange={handleChange}
              />
            </Form.Item>
            <Form.Item
              label="Points"
              name="points"
              rules={[
                {
                  required: true,
                  message: "Please input the number of points to transfer!",
                },
              ]}
            >
              <Input
                prefix={<DollarOutlined />}
                placeholder="Enter points to transfer"
                name="points"
                value={transferPointsPayload.points}
                onChange={handleChange}
              />
            </Form.Item>
            <Form.Item style={{ marginBottom: "0px" }}>
              <Button block type="primary" htmlType="submit" loading={loading}>
                Submit
              </Button>
            </Form.Item>
          </Form>
        </div>
      </section>
    </Modal>
  );
}
