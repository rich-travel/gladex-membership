import { DollarOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Form, Input, Modal } from "antd";
import { useEffect, useState } from "react";
import { BiQrScan } from "react-icons/bi";
import { FaRegImage } from "react-icons/fa6";
import { IoChevronBack } from "react-icons/io5";
import Swal from "sweetalert2";
import useAuthStore from "../../../stores/authStore";
import useTransferPointsModalStore from "../../../stores/transferPointsModalStore";
import useTransferPointsStore from "../../../stores/transferPointsStore";
import ShowQR from "./components/ShowQR";
import UploadQR from "./components/UploadQR";

export default function TransferPointsModal() {
  const [form] = Form.useForm();
  const { userInfo, getMembershipLevel } = useAuthStore();
  const transferPointsModal = useTransferPointsModalStore(
    (state) => state.transferPointsModal
  );
  const handleTransferPointsModal = useTransferPointsModalStore(
    (state) => state.handleTransferPointsModal
  );
  const fetchUserInfo = useAuthStore((state) => state.fetchUserInfo);
  const { transferPoints, loading } = useTransferPointsStore();

  const [activeTab, setActiveTab] = useState(0);

  const [transferPointsPayload, setTransferPointsPayload] = useState({
    fromMembershipId: userInfo?.membershipId,
    toMembershipId: "",
    points: "",
    transferFee: getMembershipLevel?.transferFee,
  });

  const { fetchTransferHistory } = useTransferPointsStore();

  useEffect(() => {
    setTransferPointsPayload((prev) => ({
      ...prev,
      fromMembershipId: userInfo?.membershipId,
    }));
    form.setFieldsValue({ fromMembershipId: userInfo?.membershipId });
  }, [userInfo, form]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTransferPointsPayload((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleTab = (tab) => {
    setActiveTab(tab);
  };

  const handleQrScan = (data) => {
    if (data) {
      const parsedData = JSON.parse(data);
      setTransferPointsPayload((prev) => ({
        ...prev,
        toMembershipId: parsedData.membershipId || "",
        points: parsedData.points || "",
      }));
      form.setFieldsValue({
        toMembershipId: parsedData.membershipId || "",
        points: parsedData.points || "",
      });
    }
  };

  const handleQrError = (err) => {
    console.error(err);
    Swal.fire({
      icon: "error",
      title: "QR Scan Failed",
      text: err.message,
    });
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
      fetchUserInfo(userInfo?.membershipId);
      fetchTransferHistory(userInfo?.membershipId);
      handleTransferPointsModal();
      form.resetFields(); // Reset the form fields
      setTransferPointsPayload({
        fromMembershipId: userInfo?.membershipId,
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
          <h3 className="text-center mb-3 font-bold text-lg">
            Transfer Points
          </h3>
          {activeTab !== 0 && (
            <div
              onClick={() => setActiveTab(0)}
              className="inline-flex items-center cursor-pointer gap-2 font-semibold mb-2"
            >
              <IoChevronBack />
              <span>Back</span>
            </div>
          )}
          {activeTab === 0 && (
            <div className="flex justify-around mb-4">
              <div
                className="flex flex-col items-center p-3 cursor-pointer font-semibold"
                onClick={() => handleTab(1)}
              >
                <FaRegImage className="text-xl" />
                <span>Upload QR</span>
              </div>
              <div
                className="flex flex-col items-center p-3 cursor-pointer font-semibold"
                onClick={() => handleTab(2)}
              >
                <BiQrScan className="text-xl" />
                <span>Show My QR</span>
              </div>
            </div>
          )}
          <div>
            {activeTab === 0 ? (
              <Form
                form={form}
                name="transfer_points"
                initialValues={{
                  fromMembershipId: userInfo?.membershipId,
                  transferFee: getMembershipLevel?.transferFee,
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
                  label="Transfer Fee"
                  name="transferFee"
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                >
                  <Input
                    prefix={<DollarOutlined />}
                    placeholder={transferPointsPayload.transferFee}
                    name="transferFee"
                    value={transferPointsPayload.transferFee}
                    onChange={handleChange}
                    disabled
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
                  <Button
                    className="btn"
                    block
                    type="primary"
                    htmlType="submit"
                    loading={loading}
                  >
                    Submit
                  </Button>
                </Form.Item>
              </Form>
            ) : activeTab === 1 ? (
              <UploadQR
                handleQrError={handleQrError}
                handleQrScan={handleQrScan}
                handleTab={handleTab}
              />
            ) : (
              <ShowQR />
            )}
          </div>
        </div>
      </section>
    </Modal>
  );
}
