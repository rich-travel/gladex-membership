import { UserOutlined } from "@ant-design/icons";
import { Button, Form, Input, Modal, Upload } from "antd";
import { useEffect, useState } from "react";
import { IoPricetagOutline } from "react-icons/io5";
import { LuPackageX } from "react-icons/lu";
import Swal from "sweetalert2";
import * as XLSX from "xlsx";
import useTransactionModalStore from "../../../stores/transactionModalStore";
import useTransactionPackageStore from "../../../stores/transactionPackageStore";
import { MdAttachFile } from "react-icons/md";

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

  const handleFileUpload = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const json = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      // Assuming the first row contains headers and the second row contains data
      const [headers, values] = json;
      const dataObject = headers.reduce((obj, header, index) => {
        obj[header] = values[index];
        return obj;
      }, {});

      console.log("Data Object:", dataObject);

      setTransactionPayload({
        membershipId: dataObject["membershipId"] || "",
        packageAvailed: dataObject["packageAvailed"] || "",
        packagePrice: dataObject["packagePrice"] || "",
      });

      form.setFieldsValue({
        membershipId: dataObject["membershipId"] || "",
        packageAvailed: dataObject["packageAvailed"] || "",
        packagePrice: dataObject["packagePrice"] || "",
      });
    };
    reader.readAsArrayBuffer(file);
    return false; // Prevent default upload behavior
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
          <h3 className="text-center mb-3 font-bold text-lg">Transaction</h3>
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
            {/* File Upload */}
            <Form.Item label="Upload Excel File">
              <Upload
                beforeUpload={handleFileUpload}
                accept=".xlsx, .xls"
                showUploadList={false}
              >
                <Button>
                  <MdAttachFile />
                  <span>Upload Excel File</span>
                </Button>
              </Upload>
            </Form.Item>

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
              <Button className="btn" block type="secondary" htmlType="submit">
                Submit
              </Button>
            </Form.Item>
          </Form>
        </div>
      </section>
    </Modal>
  );
}
