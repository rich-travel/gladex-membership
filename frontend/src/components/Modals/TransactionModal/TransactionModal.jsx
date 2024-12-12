import { UserOutlined } from "@ant-design/icons";
import { Button, Form, Input, Modal } from "antd";
import { useEffect, useState } from "react";
import { IoPricetagOutline } from "react-icons/io5";
import { LuPackageX } from "react-icons/lu";
import Swal from "sweetalert2";
import useTransactionModalStore from "../../../stores/transactionModalStore";
import useTransactionPackageStore from "../../../stores/transactionPackageStore";

export default function TransactionModal() {
  const [form] = Form.useForm();
  const [transactionPayload, setTransactionPayload] = useState({
    membershipId: "",
    packageAvailed: "",
    packagePrice: "",
  });

  const transactionModal = useTransactionModalStore(
    (state) => state.transactionModal
  );
  const handleTransactionModal = useTransactionModalStore(
    (state) => state.handleTransactionModal
  );

  const { addPackageToUser, fetchAllPackages } = useTransactionPackageStore();
  useEffect(() => {
    fetchAllPackages(); // Fetch packages when the component mounts
  }, [fetchAllPackages]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTransactionPayload((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      await addPackageToUser(transactionPayload);

      Swal.fire({
        icon: "success",
        title: "Transaction Successful",
        text: "You have successfully added a transaction to the user!",
      });
      handleTransactionModal();
      setTransactionPayload({
        membershipId: "",
        packageAvailed: "",
        packagePrice: "",
      });
      form.resetFields();
      fetchAllPackages();
    } catch (error) {
      console.error("Transaction failed:", error);
      Swal.fire({
        icon: "error",
        title: "Transaction Failed",
        text: error.response?.data?.message || error.message,
      });
    }
  };

  return (
    <Modal
      title={null}
      open={transactionModal}
      onCancel={handleTransactionModal}
      footer={null}
    >
      <section>
        <div className="transaction-container">
          <h3 style={{ textAlign: "center", marginBottom: "10px" }}>
            Transaction
          </h3>
          <Form
            form={form}
            name="transaction_form"
            initialValues={{
              remember: true,
            }}
            onFinish={handleSubmit}
            layout="vertical"
            requiredMark="optional"
          >
            {/* Membership ID */}
            <Form.Item
              label="Membership ID"
              name="membershipId"
              rules={[
                {
                  required: true,
                  message: "Please input your Membership ID!",
                },
              ]}
            >
              <Input
                prefix={<UserOutlined />}
                placeholder="Membership ID"
                name="membershipId"
                value={transactionPayload.membershipId}
                onChange={handleChange}
              />
            </Form.Item>

            {/* Package Availed */}
            <Form.Item
              label="Package Availed"
              name="packageAvailed"
              rules={[
                {
                  required: true,
                  message: "Please select a package!",
                },
              ]}
            >
              <Input
                prefix={<LuPackageX />}
                placeholder="Package Availed"
                name="packageAvailed"
                value={transactionPayload.packageAvailed}
                onChange={handleChange}
              />
            </Form.Item>

            {/* Package Price */}
            <Form.Item
              label="Package Price"
              name="packagePrice"
              rules={[
                {
                  required: true,
                  message: "Please input the package price!",
                },
              ]}
            >
              <Input
                prefix={<IoPricetagOutline />}
                placeholder="Package Price"
                name="packagePrice"
                value={transactionPayload.packagePrice}
                onChange={handleChange}
              />
            </Form.Item>

            <Form.Item style={{ marginBottom: "0px" }}>
              <Button block type="primary" htmlType="submit">
                Submit
              </Button>
            </Form.Item>
          </Form>
        </div>
      </section>
    </Modal>
  );
}