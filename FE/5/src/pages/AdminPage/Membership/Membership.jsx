import React, { useState } from "react";
import { Button, Form, message, Tabs } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import MembershipFilterBar from "./MembershipFilterBar";
import MembershipCardList from "./MembershipCardList";
import MembershipFormModal from "./MembershipFormModal";
import MembershipViewModal from "./MembershipViewModal";
import TransactionHistoryTab from "./TransactionHistoryTab";

const initialPackages = [
  {
    id: 1,
    name: "Gold",
    price: 500000,
    duration: 30,
    postLimit: 20,
    description: "Gói vàng cho chủ nhà",
    status: "active",
    inUse: false,
  },
  {
    id: 2,
    name: "Silver",
    price: 300000,
    duration: 15,
    postLimit: 10,
    description: "Gói bạc cho chủ nhà",
    status: "active",
    inUse: false,
  },
  {
    id: 3,
    name: "Bronze",
    price: 150000,
    duration: 7,
    postLimit: 5,
    description: "Gói đồng cho chủ nhà",
    status: "active",
    inUse: false,
  },
  {
    id: 4,
    name: "Free",
    price: 0,
    duration: 0,
    postLimit: 1,
    description: "Gói miễn phí cho người dùng mới",
    status: "active",
    inUse: false,
  },
  {
    id: 5,
    name: "Premium",
    price: 1000000,
    duration: 60,
    postLimit: 50,
    description: "Gói cao cấp cho chủ nhà",
    status: "active",
    inUse: false,
  }
];

const Membership = () => {
  const [packages, setPackages] = useState(initialPackages);
  const [filters, setFilters] = useState({ search: "", status: undefined });
  const [modal, setModal] = useState({ open: false, mode: "create", record: null });
  const [form] = Form.useForm();

  const filtered = packages.filter(pkg =>
    (!filters.search || pkg.name.toLowerCase().includes(filters.search.toLowerCase())) &&
    (!filters.status || pkg.status === filters.status)
  );

  const handleSave = () => {
    form.validateFields().then(values => {
      if (modal.mode === "create") {
        if (packages.some(pkg => pkg.name === values.name)) {
          message.error("Tên gói đã tồn tại!");
          return;
        }
        setPackages([
          { ...values, id: Date.now(), status: values.status || "active", inUse: false },
          ...packages,
        ]);
        message.success("Tạo gói thành công!");
      } else {
        if (modal.record.inUse && values.name !== modal.record.name) {
          message.error("Không thể đổi tên gói đang được sử dụng!");
          return;
        }
        setPackages(pkgs =>
          pkgs.map(pkg =>
            pkg.id === modal.record.id ? { ...pkg, ...values } : pkg
          )
        );
        message.success("Cập nhật thành công!");
      }
      setModal({ open: false, mode: "create", record: null });
      form.resetFields();
    });
  };

  const handleDelete = (record) => {
    if (record.inUse) {
      message.error("Không thể xóa gói đang được sử dụng!");
      return;
    }
    setPackages(pkgs => pkgs.filter(pkg => pkg.id !== record.id));
    message.success("Đã xóa gói!");
  };

return (
    <div className="page-container">
      <h1>Membership Management</h1>
      <Tabs
        defaultActiveKey="packages"
        items={[
          {
            key: "packages",
            label: "Membership Packages",
            children: (
              <>
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  style={{ marginBottom: 16, border: 'none', display: 'inline-block', marginRight: 10 }}
                  onClick={() => { setModal({ open: true, mode: "create", record: null }); form.resetFields(); }}
                >
                  Create New Package
                </Button>
                <MembershipFilterBar filters={filters} setFilters={setFilters} />
                <MembershipCardList
                  data={filtered}
                  onView={record => setModal({ open: true, mode: "view", record })}
                  onEdit={record => { setModal({ open: true, mode: "edit", record }); form.setFieldsValue(record); }}
                  onDelete={handleDelete}
                />
                <MembershipFormModal
                  open={modal.open && modal.mode !== "view"}
                  onCancel={() => { setModal({ open: false, mode: "create", record: null }); form.resetFields(); }}
                  onOk={handleSave}
                  form={form}
                  mode={modal.mode}
                  record={modal.record}
                />
                <MembershipViewModal
                  open={modal.open && modal.mode === "view"}
                  onCancel={() => setModal({ open: false, mode: "create", record: null })}
                  record={modal.record}
                />
              </>
            ),
          },
          {
            key: "transactions",
            label: "Transaction History",
            children: <TransactionHistoryTab />,
          },
        ]}
      />
    </div>
  );
};

export default Membership;